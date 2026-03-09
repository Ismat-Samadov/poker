'use client';
// Core game state and logic hook for Texas Hold'em Poker
import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { Difficulty, GamePhase, GameState, Player, PlayerAction } from '@/types/poker';
import { createDeck, dealCards } from '@/lib/deck';
import { evaluateBestHand, compareHands } from '@/lib/handEvaluator';
import { getAIDecision, getAIThinkTime } from '@/lib/aiPlayer';
import { playChip, playClick, playDeal, playFold, playLose, playReveal, playWin } from '@/lib/sounds';

// ─── Initial State ──────────────────────────────────────────────────────────

const STARTING_CHIPS = 1000;
const BIG_BLIND = 20;
const SMALL_BLIND = 10;

function createPlayer(id: 'player' | 'ai'): Player {
  return { id, chips: STARTING_CHIPS, cards: [], bet: 0, hasFolded: false, isAllIn: false };
}

function getInitialState(difficulty: Difficulty = 'medium', soundEnabled = true): GameState {
  const savedHighScore = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('poker-high-score') ?? '0', 10)
    : 0;
  return {
    phase: 'menu',
    deck: [],
    communityCards: [],
    pot: 0,
    currentBet: 0,
    player: createPlayer('player'),
    ai: createPlayer('ai'),
    isPlayerTurn: true,
    winner: null,
    winnerDescription: '',
    difficulty,
    roundNumber: 0,
    bigBlind: BIG_BLIND,
    smallBlind: SMALL_BLIND,
    dealerIsPlayer: true,
    message: '',
    soundEnabled,
    isPaused: false,
    highScore: savedHighScore,
    totalChipsWon: 0,
  };
}

// ─── Actions ────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'START_GAME' }
  | { type: 'START_ROUND' }
  | { type: 'DEAL_COMMUNITY'; count: number; phase: GamePhase }
  | { type: 'PLAYER_ACTION'; action: PlayerAction; raiseAmount?: number }
  | { type: 'AI_ACTION'; action: PlayerAction; raiseAmount?: number }
  | { type: 'SHOWDOWN' }
  | { type: 'NEXT_ROUND' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'RETURN_TO_MENU' };

// ─── Reducer Helpers ────────────────────────────────────────────────────────

/** Post a blind bet for a player */
function postBlind(state: GameState, playerId: 'player' | 'ai', amount: number): GameState {
  const p = state[playerId];
  const actual = Math.min(amount, p.chips);
  return {
    ...state,
    [playerId]: { ...p, chips: p.chips - actual, bet: actual, isAllIn: p.chips === actual },
    pot: state.pot + actual,
    currentBet: Math.max(state.currentBet, actual),
  };
}

/** Apply a player action and return updated state */
function applyAction(state: GameState, id: 'player' | 'ai', action: PlayerAction, raiseAmount = 0): GameState {
  const p = state[id];
  const callAmount = state.currentBet - p.bet;

  switch (action) {
    case 'fold': {
      return { ...state, [id]: { ...p, hasFolded: true } };
    }
    case 'check': {
      return state; // no chips change
    }
    case 'call': {
      const actual = Math.min(callAmount, p.chips);
      const isAllIn = actual === p.chips;
      return {
        ...state,
        [id]: { ...p, chips: p.chips - actual, bet: p.bet + actual, isAllIn },
        pot: state.pot + actual,
      };
    }
    case 'raise': {
      const totalBet = state.currentBet + raiseAmount;
      const addAmount = totalBet - p.bet;
      const actual = Math.min(addAmount, p.chips);
      const isAllIn = actual === p.chips;
      return {
        ...state,
        [id]: { ...p, chips: p.chips - actual, bet: p.bet + actual, isAllIn },
        pot: state.pot + actual,
        currentBet: p.bet + actual,
      };
    }
    case 'allin': {
      const allIn = p.chips;
      const newBet = p.bet + allIn;
      return {
        ...state,
        [id]: { ...p, chips: 0, bet: newBet, isAllIn: true },
        pot: state.pot + allIn,
        currentBet: Math.max(state.currentBet, newBet),
      };
    }
  }
}

/** Determine winner at showdown */
function resolveShowdown(state: GameState): GameState {
  const { player, ai, communityCards, pot } = state;

  // One player folded
  if (player.hasFolded) {
    return {
      ...state,
      ai: { ...ai, chips: ai.chips + pot },
      winner: 'ai',
      winnerDescription: 'AI wins — you folded',
      phase: 'ended',
    };
  }
  if (ai.hasFolded) {
    return {
      ...state,
      player: { ...player, chips: player.chips + pot },
      winner: 'player',
      winnerDescription: 'You win — AI folded!',
      phase: 'ended',
    };
  }

  // Evaluate hands
  const playerHand = evaluateBestHand([...player.cards, ...communityCards]);
  const aiHand = evaluateBestHand([...ai.cards, ...communityCards]);
  const cmp = compareHands(playerHand, aiHand);

  if (cmp > 0) {
    return {
      ...state,
      player: { ...player, chips: player.chips + pot, handResult: playerHand },
      ai: { ...ai, handResult: aiHand },
      winner: 'player',
      winnerDescription: `You win with ${playerHand.description}!`,
      phase: 'ended',
    };
  } else if (cmp < 0) {
    return {
      ...state,
      ai: { ...ai, chips: ai.chips + pot, handResult: aiHand },
      player: { ...player, handResult: playerHand },
      winner: 'ai',
      winnerDescription: `AI wins with ${aiHand.description}`,
      phase: 'ended',
    };
  } else {
    // Tie — split the pot
    const half = Math.floor(pot / 2);
    return {
      ...state,
      player: { ...player, chips: player.chips + half, handResult: playerHand },
      ai: { ...ai, chips: ai.chips + half, handResult: aiHand },
      winner: 'tie',
      winnerDescription: `Tie! Both have ${playerHand.description}`,
      phase: 'ended',
    };
  }
}

// ─── Main Reducer ────────────────────────────────────────────────────────────

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.difficulty };

    case 'START_GAME': {
      return {
        ...getInitialState(state.difficulty, state.soundEnabled),
        phase: 'dealing',
        highScore: state.highScore,
        roundNumber: 1,
      };
    }

    case 'START_ROUND': {
      const deck = createDeck();
      // Deal 2 cards to player and 2 to AI
      const { cards: playerCards, remaining: d1 } = dealCards(deck, 2, true);
      const { cards: aiCards, remaining: d2 } = dealCards(d1, 2, false); // AI cards face down

      // Reset players for new round
      let s: GameState = {
        ...state,
        deck: d2,
        communityCards: [],
        pot: 0,
        currentBet: 0,
        player: { ...state.player, cards: playerCards, bet: 0, hasFolded: false, isAllIn: false, handResult: undefined },
        ai: { ...state.ai, cards: aiCards, bet: 0, hasFolded: false, isAllIn: false, handResult: undefined },
        winner: null,
        winnerDescription: '',
        message: '',
        phase: 'preflop',
      };

      // Post blinds: dealer posts small blind, other posts big blind
      const smallId: 'player' | 'ai' = s.dealerIsPlayer ? 'player' : 'ai';
      const bigId: 'player' | 'ai' = s.dealerIsPlayer ? 'ai' : 'player';
      s = postBlind(s, smallId, SMALL_BLIND);
      s = postBlind(s, bigId, BIG_BLIND);

      // First to act preflop is small blind (dealer)
      s.isPlayerTurn = smallId === 'player';
      s.message = `Round ${s.roundNumber} — Pre-flop`;

      return s;
    }

    case 'DEAL_COMMUNITY': {
      const { cards, remaining } = dealCards(state.deck, action.count, true);
      return {
        ...state,
        deck: remaining,
        communityCards: [...state.communityCards, ...cards],
        phase: action.phase,
        currentBet: 0,
        player: { ...state.player, bet: 0 },
        ai: { ...state.ai, bet: 0 },
        isPlayerTurn: !state.dealerIsPlayer, // big blind acts first post-flop
        message: action.phase === 'flop' ? 'Flop' : action.phase === 'turn' ? 'Turn' : 'River',
      };
    }

    case 'PLAYER_ACTION': {
      const s = applyAction(state, 'player', action.action, action.raiseAmount);
      if (action.action === 'fold') {
        return resolveShowdown({ ...s, phase: 'showdown' });
      }
      return { ...s, isPlayerTurn: false };
    }

    case 'AI_ACTION': {
      const s = applyAction(state, 'ai', action.action, action.raiseAmount);
      if (action.action === 'fold') {
        return resolveShowdown({ ...s, phase: 'showdown' });
      }
      return { ...s, isPlayerTurn: true };
    }

    case 'SHOWDOWN': {
      // Reveal AI cards
      const aiWithRevealedCards = {
        ...state.ai,
        cards: state.ai.cards.map(c => ({ ...c, faceUp: true })),
      };
      return resolveShowdown({ ...state, ai: aiWithRevealedCards, phase: 'showdown' });
    }

    case 'NEXT_ROUND': {
      // Check for game over
      const playerBroke = state.player.chips <= 0;
      const aiBroke = state.ai.chips <= 0;

      if (playerBroke || aiBroke) {
        const totalWon = state.player.chips - STARTING_CHIPS;
        const newHighScore = Math.max(state.highScore, state.player.chips);
        if (typeof window !== 'undefined') {
          localStorage.setItem('poker-high-score', String(newHighScore));
        }
        return {
          ...state,
          phase: 'ended',
          winner: playerBroke ? 'ai' : 'player',
          winnerDescription: playerBroke ? 'Game Over — you ran out of chips!' : 'Congratulations! You busted the AI!',
          highScore: newHighScore,
          totalChipsWon: Math.max(0, totalWon),
        };
      }

      return {
        ...state,
        roundNumber: state.roundNumber + 1,
        dealerIsPlayer: !state.dealerIsPlayer, // rotate dealer
        phase: 'dealing',
      };
    }

    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };

    case 'TOGGLE_PAUSE':
      return { ...state, isPaused: !state.isPaused };

    case 'RETURN_TO_MENU':
      return { ...getInitialState(state.difficulty, state.soundEnabled), highScore: state.highScore };

    default:
      return state;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function usePokerGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => getInitialState());
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionInProgress = useRef(false);

  const sound = useCallback((fn: () => void) => {
    if (state.soundEnabled) fn();
  }, [state.soundEnabled]);

  // ── Derived flags ────────────────────────────────────────────────────────
  const canCheck = state.currentBet === state.player.bet;
  const canCall = state.currentBet > state.player.bet && state.player.chips > 0;
  const callAmount = Math.min(state.currentBet - state.player.bet, state.player.chips);
  const minRaise = state.bigBlind;

  // ── Actions ──────────────────────────────────────────────────────────────

  const setDifficulty = useCallback((d: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', difficulty: d });
  }, []);

  const startGame = useCallback(() => {
    sound(playClick);
    dispatch({ type: 'START_GAME' });
  }, [sound]);

  const startRound = useCallback(() => {
    sound(playDeal);
    dispatch({ type: 'START_ROUND' });
  }, [sound]);

  const playerAction = useCallback((action: PlayerAction, raiseAmount?: number) => {
    if (!state.isPlayerTurn || state.isPaused || state.phase === 'ended') return;
    if (action === 'fold') sound(playFold);
    else if (action === 'raise' || action === 'allin') sound(playChip);
    else sound(playChip);
    dispatch({ type: 'PLAYER_ACTION', action, raiseAmount });
  }, [state.isPlayerTurn, state.isPaused, state.phase, sound]);

  const nextRound = useCallback(() => {
    dispatch({ type: 'NEXT_ROUND' });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  const togglePause = useCallback(() => {
    dispatch({ type: 'TOGGLE_PAUSE' });
  }, []);

  const returnToMenu = useCallback(() => {
    dispatch({ type: 'RETURN_TO_MENU' });
  }, []);

  // ── AI turn logic ────────────────────────────────────────────────────────

  useEffect(() => {
    if (state.isPaused) return;
    if (state.isPlayerTurn) return;
    if (state.phase === 'ended' || state.phase === 'showdown' || state.phase === 'menu' || state.phase === 'dealing') return;
    if (state.ai.hasFolded || state.player.hasFolded) return;
    if (actionInProgress.current) return;

    actionInProgress.current = true;
    const delay = getAIThinkTime(state.difficulty);

    aiTimerRef.current = setTimeout(() => {
      actionInProgress.current = false;
      const decision = getAIDecision(state);
      if (decision.action === 'fold') sound(playFold);
      else sound(playChip);
      dispatch({ type: 'AI_ACTION', action: decision.action, raiseAmount: decision.raiseAmount });
    }, delay);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      actionInProgress.current = false;
    };
  }, [state, sound]);

  // ── Betting round completion logic ───────────────────────────────────────
  // After each player/AI action, check if the betting round is over
  useEffect(() => {
    if (state.isPaused) return;
    const { phase, player, ai, currentBet, isPlayerTurn } = state;
    if (phase === 'ended' || phase === 'showdown' || phase === 'menu' || phase === 'dealing') return;

    const bettingDone =
      !isPlayerTurn && // AI just acted (or player already acted)
      !ai.hasFolded &&
      !player.hasFolded &&
      (player.isAllIn || player.bet === currentBet) &&
      (ai.isAllIn || ai.bet === currentBet);

    if (!bettingDone) return;

    // Move to next phase
    const timer = setTimeout(() => {
      if (phase === 'preflop') {
        sound(playReveal);
        dispatch({ type: 'DEAL_COMMUNITY', count: 3, phase: 'flop' });
      } else if (phase === 'flop') {
        sound(playReveal);
        dispatch({ type: 'DEAL_COMMUNITY', count: 1, phase: 'turn' });
      } else if (phase === 'turn') {
        sound(playReveal);
        dispatch({ type: 'DEAL_COMMUNITY', count: 1, phase: 'river' });
      } else if (phase === 'river') {
        dispatch({ type: 'SHOWDOWN' });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [state, sound]);

  // ── Win/lose sound effect ────────────────────────────────────────────────
  useEffect(() => {
    if (state.phase === 'ended' && state.winner) {
      if (state.winner === 'player') sound(playWin);
      else if (state.winner === 'ai') sound(playLose);
    }
  }, [state.phase, state.winner, sound]);

  // ── Auto-start round when phase switches to 'dealing' ───────────────────
  useEffect(() => {
    if (state.phase === 'dealing') {
      const t = setTimeout(() => startRound(), 300);
      return () => clearTimeout(t);
    }
  }, [state.phase, state.roundNumber, startRound]);

  return {
    state,
    canCheck,
    canCall,
    callAmount,
    minRaise,
    startGame,
    playerAction,
    nextRound,
    toggleSound,
    togglePause,
    returnToMenu,
    setDifficulty,
  };
}
