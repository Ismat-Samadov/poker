'use client';
// Pot display with animated chip counter
import { motion, AnimatePresence } from 'framer-motion';

interface PotDisplayProps {
  pot: number;
  currentBet: number;
  phase: string;
  roundNumber: number;
}

export default function PotDisplay({ pot, currentBet, phase, roundNumber }: PotDisplayProps) {
  const phaseLabels: Record<string, string> = {
    preflop: 'Pre-Flop',
    flop: 'Flop',
    turn: 'Turn',
    river: 'River',
    showdown: 'Showdown',
    ended: 'Round Over',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Phase indicator */}
      <motion.div
        key={phase}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-xs font-semibold tracking-widest uppercase text-white/40"
      >
        {phaseLabels[phase] ?? phase} &bull; Round {roundNumber}
      </motion.div>

      {/* Pot */}
      <motion.div
        layout
        className="flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-yellow-500/30 rounded-full px-5 py-1.5"
      >
        {/* Chip icon */}
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.5)] flex items-center justify-center">
          <span className="text-[8px] font-black text-yellow-900">$</span>
        </div>

        <span className="text-sm font-bold text-white/70">Pot</span>

        <AnimatePresence mode="wait">
          <motion.span
            key={pot}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="text-lg font-black text-yellow-400 min-w-[60px] text-center"
          >
            {pot.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Current bet */}
      {currentBet > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-purple-300/80"
        >
          Current bet: <span className="font-bold text-purple-300">{currentBet}</span>
        </motion.div>
      )}
    </div>
  );
}
