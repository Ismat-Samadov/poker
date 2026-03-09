// AI opponent decision-making logic
// Three difficulty tiers: easy, medium, hard
import type { GameState, PlayerAction, Difficulty } from '@/types/poker';
import { estimateHandStrength } from './handEvaluator';

export interface AIDecision {
  action: PlayerAction;
  raiseAmount?: number;
}

/** Get the AI's next action based on game state and difficulty */
export function getAIDecision(state: GameState): AIDecision {
  switch (state.difficulty) {
    case 'easy':
      return easyAI(state);
    case 'medium':
      return mediumAI(state);
    case 'hard':
      return hardAI(state);
  }
}

// ─── Easy AI ───────────────────────────────────────────────────────────────
// Plays mostly randomly; rarely bluffs; doesn't consider pot odds
function easyAI(state: GameState): AIDecision {
  const { ai, player, currentBet, pot, bigBlind } = state;
  const callAmount = currentBet - ai.bet;
  const strength = estimateHandStrength(ai.cards, state.communityCards);
  const roll = Math.random();

  // High-strength hands: bet/raise
  if (strength > 0.65) {
    if (roll < 0.6) {
      const raise = bigBlind * (1 + Math.floor(Math.random() * 3));
      return { action: 'raise', raiseAmount: Math.min(raise, ai.chips) };
    }
    return callAmount > 0 ? { action: 'call' } : { action: 'check' };
  }

  // Medium-strength: usually call, sometimes fold
  if (strength > 0.35) {
    if (callAmount > ai.chips * 0.3 && roll < 0.3) return { action: 'fold' };
    return callAmount > 0 ? { action: 'call' } : { action: 'check' };
  }

  // Weak hand: often fold when facing a bet
  if (callAmount > 0) {
    if (roll < 0.55) return { action: 'fold' };
    return { action: 'call' };
  }

  // No bet to call — occasionally bluff raise, otherwise check
  if (roll < 0.1) {
    return { action: 'raise', raiseAmount: bigBlind * 2 };
  }
  return { action: 'check' };
}

// ─── Medium AI ─────────────────────────────────────────────────────────────
// Considers hand strength and pot odds; occasional bluffs
function mediumAI(state: GameState): AIDecision {
  const { ai, currentBet, pot, bigBlind, phase } = state;
  const callAmount = currentBet - ai.bet;
  const strength = estimateHandStrength(ai.cards, state.communityCards);
  const potOdds = callAmount > 0 ? callAmount / (pot + callAmount) : 0;
  const roll = Math.random();

  // All-in on very strong hands
  if (strength > 0.85 && roll < 0.4) {
    return { action: 'allin' };
  }

  // Strong hand: raise
  if (strength > 0.65) {
    const raiseSize = Math.round(pot * 0.6);
    return { action: 'raise', raiseAmount: Math.min(raiseSize, ai.chips) };
  }

  // Decent hand: call if pot odds are favorable
  if (strength > 0.4) {
    if (callAmount > 0 && potOdds < strength) {
      return { action: 'call' };
    }
    if (callAmount === 0) {
      if (roll < 0.3) {
        const raise = bigBlind * 2;
        return { action: 'raise', raiseAmount: Math.min(raise, ai.chips) };
      }
      return { action: 'check' };
    }
    // Too expensive to call
    if (roll < 0.2) return { action: 'call' }; // stubborn call
    return { action: 'fold' };
  }

  // Bluff in late streets with some frequency
  const isLateStreet = phase === 'turn' || phase === 'river';
  if (isLateStreet && roll < 0.15 && callAmount === 0) {
    const bluff = Math.round(pot * 0.5);
    return { action: 'raise', raiseAmount: Math.min(bluff, ai.chips) };
  }

  // Weak hand: fold if called, check if free
  if (callAmount > 0) return { action: 'fold' };
  return { action: 'check' };
}

// ─── Hard AI ───────────────────────────────────────────────────────────────
// Uses hand strength, pot odds, position, and semi-bluffing
function hardAI(state: GameState): AIDecision {
  const { ai, player, currentBet, pot, bigBlind, phase, dealerIsPlayer } = state;
  const callAmount = currentBet - ai.bet;
  const strength = estimateHandStrength(ai.cards, state.communityCards);
  const potOdds = callAmount > 0 ? callAmount / (pot + callAmount) : 0;
  const inPosition = !dealerIsPlayer; // AI in position when AI is dealer
  const stackRatio = ai.chips / (ai.chips + player.chips);
  const roll = Math.random();

  // Monster hand: always build the pot
  if (strength > 0.88) {
    if (roll < 0.7) {
      const raise = Math.round(pot * (0.75 + Math.random() * 0.5));
      return { action: 'raise', raiseAmount: Math.min(raise, ai.chips) };
    }
    return callAmount > 0 ? { action: 'call' } : { action: 'check' }; // slow play occasionally
  }

  // Very strong hand
  if (strength > 0.72) {
    const raise = Math.round(pot * (0.5 + Math.random() * 0.4));
    return { action: 'raise', raiseAmount: Math.min(raise, ai.chips) };
  }

  // Good hand: value bet, consider position
  if (strength > 0.55) {
    if (callAmount > 0 && potOdds < strength) {
      // Occasionally re-raise when in position
      if (inPosition && roll < 0.35) {
        const reraise = Math.round(callAmount * 2.5);
        return { action: 'raise', raiseAmount: Math.min(reraise, ai.chips) };
      }
      return { action: 'call' };
    }
    if (callAmount === 0) {
      const bet = Math.round(pot * (0.4 + Math.random() * 0.3));
      return { action: 'raise', raiseAmount: Math.min(bet, ai.chips) };
    }
    return { action: 'fold' };
  }

  // Drawing hand: semi-bluff with some equity
  if (strength > 0.3) {
    if (callAmount === 0) {
      if (roll < 0.25) {
        const bet = Math.round(pot * 0.4);
        return { action: 'raise', raiseAmount: Math.min(bet, ai.chips) };
      }
      return { action: 'check' };
    }
    if (potOdds < strength + 0.1) return { action: 'call' };
    if (inPosition && roll < 0.2) {
      // Bluff raise to steal
      const bluff = Math.round(callAmount * 2.2);
      return { action: 'raise', raiseAmount: Math.min(bluff, ai.chips) };
    }
    return { action: 'fold' };
  }

  // Weak hand
  if (callAmount > 0) {
    // Bluff-raise in position on later streets
    if (inPosition && (phase === 'turn' || phase === 'river') && roll < 0.18) {
      const bluff = Math.round(pot * 0.65);
      return { action: 'raise', raiseAmount: Math.min(bluff, ai.chips) };
    }
    return { action: 'fold' };
  }

  // Free check, or occasional bluff
  if (inPosition && roll < 0.2) {
    const bluff = Math.round(pot * 0.5);
    return { action: 'raise', raiseAmount: Math.min(bluff, ai.chips) };
  }
  return { action: 'check' };
}

/** Determine AI's delay before acting (ms) for realism */
export function getAIThinkTime(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return 600 + Math.random() * 800;
    case 'medium': return 900 + Math.random() * 1100;
    case 'hard': return 1200 + Math.random() * 1500;
  }
}
