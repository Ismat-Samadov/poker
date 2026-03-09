'use client';
// Displays a player's hole cards with their info panel
import { motion } from 'framer-motion';
import type { Player } from '@/types/poker';
import Card from './Card';

interface PlayerHandProps {
  player: Player;
  label: string;
  isActive: boolean; // currently whose turn it is
  showChips: boolean;
  handDescription?: string;
  isWinner: boolean;
}

export default function PlayerHand({
  player,
  label,
  isActive,
  showChips,
  handDescription,
  isWinner,
}: PlayerHandProps) {
  const isAI = player.id === 'ai';

  return (
    <div className={`flex flex-col items-center gap-2 ${isAI ? 'flex-col-reverse' : 'flex-col'}`}>
      {/* Cards */}
      <div className="flex gap-2 items-center">
        {player.hasFolded ? (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0.35, scale: 0.9 }}
            className="flex gap-2"
          >
            {player.cards.map((card, i) => (
              <Card key={card.id} card={{ ...card, faceUp: false }} index={i} size="md" />
            ))}
          </motion.div>
        ) : (
          player.cards.map((card, i) => (
            <Card
              key={card.id}
              card={card}
              index={i}
              size="md"
              highlight={isWinner && card.faceUp}
            />
          ))
        )}
      </div>

      {/* Info panel */}
      <motion.div
        animate={{
          boxShadow: isActive
            ? '0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.3)'
            : '0 0 0px transparent',
        }}
        transition={{ duration: 0.4 }}
        className={`rounded-xl px-4 py-2 backdrop-blur-sm border text-center min-w-[140px]
          ${isActive
            ? 'bg-cyan-900/50 border-cyan-400/60 text-cyan-100'
            : 'bg-white/5 border-white/10 text-white/70'
          }
          ${player.hasFolded ? 'opacity-40' : ''}
        `}
      >
        <div className="font-bold text-sm">{label}</div>
        {showChips && (
          <div className="text-xs mt-0.5">
            <span className="text-yellow-400 font-semibold">
              {player.chips.toLocaleString()}
            </span>
            <span className="text-white/50 ml-1">chips</span>
          </div>
        )}
        {player.bet > 0 && !player.hasFolded && (
          <div className="text-xs text-purple-300 mt-0.5">
            Bet: {player.bet}
          </div>
        )}
        {player.hasFolded && (
          <div className="text-xs text-red-400 font-semibold mt-0.5">FOLDED</div>
        )}
        {player.isAllIn && !player.hasFolded && (
          <div className="text-xs text-orange-400 font-bold mt-0.5">ALL IN!</div>
        )}
        {/* Hand description shown at showdown */}
        {handDescription && !player.hasFolded && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] text-cyan-300 mt-1 font-medium"
          >
            {handDescription}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
