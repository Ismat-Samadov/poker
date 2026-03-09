// Deck management: creation, shuffling, dealing
import type { Card, Suit, Rank } from '@/types/poker';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

/** Create a fresh shuffled 52-card deck */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        faceUp: false,
        id: `${suit}-${rank}`,
      });
    }
  }
  return shuffle(deck);
}

/** Fisher-Yates shuffle */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Deal N cards from the top of the deck */
export function dealCards(deck: Card[], count: number, faceUp = true): { cards: Card[]; remaining: Card[] } {
  const cards = deck.slice(0, count).map(c => ({ ...c, faceUp }));
  const remaining = deck.slice(count);
  return { cards, remaining };
}

/** Get display rank label (J, Q, K, A for face cards) */
export function getRankLabel(rank: Rank): string {
  const labels: Record<number, string> = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' };
  return labels[rank] ?? String(rank);
}

/** Get suit symbol */
export function getSuitSymbol(suit: Suit): string {
  const symbols: Record<Suit, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  };
  return symbols[suit];
}

/** Is the suit red? */
export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}
