'use client';
// Community cards (flop, turn, river) with empty slot placeholders
import { motion } from 'framer-motion';
import type { Card as CardType } from '@/types/poker';
import Card from './Card';

interface CommunityCardsProps {
  cards: CardType[];
}

export default function CommunityCards({ cards }: CommunityCardsProps) {
  // Show 5 slots; fill with actual cards, rest are empty placeholders
  const slots = Array(5).fill(null).map((_, i) => cards[i] ?? null);

  return (
    <div className="flex gap-2 sm:gap-3 items-center justify-center">
      {slots.map((card, i) => (
        <div key={i}>
          {card ? (
            <Card card={card} index={i} size="lg" />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-16 h-24 rounded-lg border-2 border-dashed border-white/15 bg-white/5"
            />
          )}
        </div>
      ))}
    </div>
  );
}
