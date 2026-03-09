'use client';
// Single playing card component with flip animation
import { motion } from 'framer-motion';
import type { Card as CardType } from '@/types/poker';
import { getRankLabel, getSuitSymbol, isRedSuit } from '@/lib/deck';

interface CardProps {
  card: CardType;
  index?: number;
  highlight?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Card({ card, index = 0, highlight = false, size = 'md' }: CardProps) {
  const sizeClasses = {
    sm: 'w-10 h-14 text-xs',
    md: 'w-14 h-20 text-sm',
    lg: 'w-16 h-24 text-base',
  };

  const rankLabel = getRankLabel(card.rank);
  const suitSymbol = getSuitSymbol(card.suit);
  const isRed = isRedSuit(card.suit);

  return (
    <motion.div
      initial={{ opacity: 0, y: -40, rotateY: 180 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, type: 'spring', stiffness: 200 }}
      className={`relative select-none perspective-500 ${sizeClasses[size]}`}
      style={{ perspective: '500px' }}
    >
      <motion.div
        animate={{ rotateY: card.faceUp ? 0 : 180 }}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="w-full h-full relative"
      >
        {/* Front face */}
        <div
          className={`absolute inset-0 rounded-lg border-2 flex flex-col justify-between p-1 backface-visible
            ${card.faceUp ? '' : 'hidden'}
            ${highlight
              ? 'bg-yellow-50 border-yellow-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]'
              : 'bg-white border-gray-200 shadow-lg'
            }
          `}
          style={{ backfaceVisibility: 'visible' }}
        >
          {/* Top-left rank + suit */}
          <div className={`flex flex-col items-start leading-none font-bold ${isRed ? 'text-red-500' : 'text-gray-900'}`}>
            <span className="text-[0.7em] font-black">{rankLabel}</span>
            <span className="text-[0.65em]">{suitSymbol}</span>
          </div>

          {/* Center suit */}
          <div className={`flex items-center justify-center text-[1.4em] ${isRed ? 'text-red-500' : 'text-gray-800'}`}>
            {suitSymbol}
          </div>

          {/* Bottom-right rank + suit (inverted) */}
          <div className={`flex flex-col items-end leading-none font-bold rotate-180 ${isRed ? 'text-red-500' : 'text-gray-900'}`}>
            <span className="text-[0.7em] font-black">{rankLabel}</span>
            <span className="text-[0.65em]">{suitSymbol}</span>
          </div>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-lg border-2 border-indigo-700 overflow-hidden shadow-lg"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Card back pattern */}
          <div className="w-full h-full bg-gradient-to-br from-indigo-800 via-indigo-900 to-indigo-800 flex items-center justify-center">
            <div className="w-[80%] h-[85%] border border-indigo-600 rounded flex items-center justify-center">
              <div
                className="w-full h-full opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #4f46e5 0, #4f46e5 1px, transparent 0, transparent 50%)',
                  backgroundSize: '6px 6px',
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
