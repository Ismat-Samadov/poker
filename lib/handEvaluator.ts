// Texas Hold'em hand evaluator
// Finds the best 5-card hand from any set of 5-7 cards
import type { Card, HandRank, HandResult } from '@/types/poker';

/** Numeric value for each hand rank (higher = better) */
export const HAND_VALUES: Record<HandRank, number> = {
  high_card: 0,
  pair: 1,
  two_pair: 2,
  three_of_a_kind: 3,
  straight: 4,
  flush: 5,
  full_house: 6,
  four_of_a_kind: 7,
  straight_flush: 8,
  royal_flush: 9,
};

/** Generate all C(n, 5) combinations of 5 cards from an array */
function getCombinations(cards: Card[], k: number): Card[][] {
  if (k === 0) return [[]];
  if (cards.length === 0) return [];
  const [first, ...rest] = cards;
  const withFirst = getCombinations(rest, k - 1).map(combo => [first, ...combo]);
  const withoutFirst = getCombinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

/** Count occurrences of each rank */
function countRanks(cards: Card[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const card of cards) {
    counts.set(card.rank, (counts.get(card.rank) ?? 0) + 1);
  }
  return counts;
}

/** Check if 5 cards form a straight; returns the high card rank or -1 */
function getStraightHigh(ranks: number[]): number {
  const sorted = [...new Set(ranks)].sort((a, b) => b - a);
  // Check normal straight
  if (sorted.length >= 5) {
    for (let i = 0; i <= sorted.length - 5; i++) {
      if (sorted[i] - sorted[i + 4] === 4 &&
          sorted[i] - sorted[i + 1] === 1 &&
          sorted[i + 1] - sorted[i + 2] === 1 &&
          sorted[i + 2] - sorted[i + 3] === 1 &&
          sorted[i + 3] - sorted[i + 4] === 1) {
        return sorted[i];
      }
    }
  }
  // Check wheel straight (A-2-3-4-5)
  if (sorted.includes(14) && sorted.includes(2) && sorted.includes(3) && sorted.includes(4) && sorted.includes(5)) {
    return 5;
  }
  return -1;
}

/** Evaluate exactly 5 cards and return a HandResult */
function evaluateFiveCards(cards: Card[]): HandResult {
  const ranks = cards.map(c => c.rank).sort((a, b) => b - a);
  const suits = cards.map(c => c.suit);
  const rankCounts = countRanks(cards);

  const isFlush = suits.every(s => s === suits[0]);
  const straightHigh = getStraightHigh(ranks);
  const isStraight = straightHigh !== -1;

  // Group ranks by count for easier pattern matching
  const countGroups = Array.from(rankCounts.entries())
    .sort((a, b) => b[1] - a[1] || b[0] - a[0]); // sort by count desc, then rank desc

  const counts = countGroups.map(([, c]) => c);
  const topRanks = countGroups.map(([r]) => r);

  // Royal Flush
  if (isFlush && isStraight && straightHigh === 14) {
    return { rank: 'royal_flush', value: 9, description: 'Royal Flush', tiebreakers: [14] };
  }

  // Straight Flush
  if (isFlush && isStraight) {
    return { rank: 'straight_flush', value: 8, description: `Straight Flush, ${getCardName(straightHigh)} high`, tiebreakers: [straightHigh] };
  }

  // Four of a Kind
  if (counts[0] === 4) {
    const kicker = topRanks[1];
    return { rank: 'four_of_a_kind', value: 7, description: `Four of a Kind, ${getCardName(topRanks[0])}s`, tiebreakers: [topRanks[0], kicker] };
  }

  // Full House
  if (counts[0] === 3 && counts[1] === 2) {
    return { rank: 'full_house', value: 6, description: `Full House, ${getCardName(topRanks[0])}s full of ${getCardName(topRanks[1])}s`, tiebreakers: [topRanks[0], topRanks[1]] };
  }

  // Flush
  if (isFlush) {
    return { rank: 'flush', value: 5, description: `Flush, ${getCardName(ranks[0])} high`, tiebreakers: ranks };
  }

  // Straight
  if (isStraight) {
    return { rank: 'straight', value: 4, description: `Straight, ${getCardName(straightHigh)} high`, tiebreakers: [straightHigh] };
  }

  // Three of a Kind
  if (counts[0] === 3) {
    const kickers = topRanks.slice(1);
    return { rank: 'three_of_a_kind', value: 3, description: `Three of a Kind, ${getCardName(topRanks[0])}s`, tiebreakers: [topRanks[0], ...kickers] };
  }

  // Two Pair
  if (counts[0] === 2 && counts[1] === 2) {
    const kicker = topRanks[2];
    return { rank: 'two_pair', value: 2, description: `Two Pair, ${getCardName(topRanks[0])}s and ${getCardName(topRanks[1])}s`, tiebreakers: [topRanks[0], topRanks[1], kicker] };
  }

  // One Pair
  if (counts[0] === 2) {
    const kickers = topRanks.slice(1);
    return { rank: 'pair', value: 1, description: `Pair of ${getCardName(topRanks[0])}s`, tiebreakers: [topRanks[0], ...kickers] };
  }

  // High Card
  return { rank: 'high_card', value: 0, description: `High Card, ${getCardName(ranks[0])}`, tiebreakers: ranks };
}

/** Find the best 5-card hand from 5-7 cards */
export function evaluateBestHand(cards: Card[]): HandResult {
  if (cards.length < 5) {
    throw new Error('Need at least 5 cards to evaluate a hand');
  }
  if (cards.length === 5) {
    return evaluateFiveCards(cards);
  }

  const combinations = getCombinations(cards, 5);
  let best: HandResult | null = null;

  for (const combo of combinations) {
    const result = evaluateFiveCards(combo);
    if (!best || compareHands(result, best) > 0) {
      best = result;
    }
  }

  return best!;
}

/** Compare two hands. Returns positive if a > b, negative if a < b, 0 if tie */
export function compareHands(a: HandResult, b: HandResult): number {
  if (a.value !== b.value) return a.value - b.value;
  // Same rank — compare tiebreakers
  for (let i = 0; i < Math.max(a.tiebreakers.length, b.tiebreakers.length); i++) {
    const av = a.tiebreakers[i] ?? 0;
    const bv = b.tiebreakers[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}

/** Get a human-readable card name */
function getCardName(rank: number): string {
  const names: Record<number, string> = { 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace' };
  return names[rank] ?? String(rank);
}

/** Estimate hand strength as a value 0-1 for AI use */
export function estimateHandStrength(holeCards: Card[], communityCards: Card[]): number {
  const allCards = [...holeCards, ...communityCards];

  if (allCards.length < 5) {
    // Preflop: estimate based on hole cards only
    return estimatePreflopStrength(holeCards);
  }

  const result = evaluateBestHand(allCards);
  // Normalize value to 0-1
  const base = result.value / 9;
  const tiebreakerBonus = (result.tiebreakers[0] ?? 0) / (14 * 9 * 10); // small bonus for high cards
  return Math.min(1, base + tiebreakerBonus);
}

/** Preflop hand strength estimation */
function estimatePreflopStrength(holeCards: Card[]): number {
  if (holeCards.length < 2) return 0;
  const [a, b] = holeCards.sort((x, y) => y.rank - x.rank);
  const isPair = a.rank === b.rank;
  const isSuited = a.suit === b.suit;
  const gap = a.rank - b.rank;
  const highCard = a.rank;

  let strength = 0;

  // Pocket pairs
  if (isPair) {
    strength = 0.5 + (highCard - 2) / 24; // 0.5 to ~1.0 for AA
    return Math.min(1, strength);
  }

  // High card base
  strength = (highCard - 2) / 16 * 0.4;

  // Suited bonus
  if (isSuited) strength += 0.05;

  // Connected bonus
  if (gap === 1) strength += 0.08;
  else if (gap === 2) strength += 0.04;

  // Premium starting hands
  if (highCard === 14) strength += 0.15; // Ace-x

  return Math.min(1, Math.max(0, strength));
}
