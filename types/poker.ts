// Core type definitions for the Texas Hold'em Poker game

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
  id: string; // unique id for animation keys
}

export type HandRank =
  | 'royal_flush'
  | 'straight_flush'
  | 'four_of_a_kind'
  | 'full_house'
  | 'flush'
  | 'straight'
  | 'three_of_a_kind'
  | 'two_pair'
  | 'pair'
  | 'high_card';

export interface HandResult {
  rank: HandRank;
  value: number; // numeric value for comparison (0-9)
  description: string; // human-readable description
  tiebreakers: number[]; // ordered values for breaking ties
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GamePhase =
  | 'menu'
  | 'dealing'
  | 'preflop'
  | 'flop'
  | 'turn'
  | 'river'
  | 'showdown'
  | 'ended';

export type PlayerAction = 'fold' | 'check' | 'call' | 'raise' | 'allin';

export interface Player {
  id: 'player' | 'ai';
  chips: number;
  cards: Card[];
  bet: number; // amount bet in current round
  hasFolded: boolean;
  isAllIn: boolean;
  handResult?: HandResult;
}

export interface GameState {
  phase: GamePhase;
  deck: Card[];
  communityCards: Card[];
  pot: number;
  currentBet: number; // the current highest bet on the table
  player: Player;
  ai: Player;
  isPlayerTurn: boolean;
  winner: 'player' | 'ai' | 'tie' | null;
  winnerDescription: string;
  difficulty: Difficulty;
  roundNumber: number;
  bigBlind: number;
  smallBlind: number;
  dealerIsPlayer: boolean; // true = player is dealer/small blind, false = AI is dealer
  message: string; // status message to display
  soundEnabled: boolean;
  isPaused: boolean;
  highScore: number;
  totalChipsWon: number; // for high score tracking
}
