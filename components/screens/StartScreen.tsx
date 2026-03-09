'use client';
// Main menu / start screen
import { motion } from 'framer-motion';
import type { Difficulty } from '@/types/poker';

interface StartScreenProps {
  difficulty: Difficulty;
  highScore: number;
  soundEnabled: boolean;
  onStart: () => void;
  onSetDifficulty: (d: Difficulty) => void;
  onToggleSound: () => void;
}

const DIFFICULTIES: { id: Difficulty; label: string; description: string; color: string }[] = [
  { id: 'easy', label: 'Easy', description: 'Relaxed AI — great for beginners', color: 'from-emerald-600 to-emerald-700 border-emerald-500/50' },
  { id: 'medium', label: 'Medium', description: 'Balanced AI with pot odds awareness', color: 'from-blue-600 to-blue-700 border-blue-500/50' },
  { id: 'hard', label: 'Hard', description: 'Strategic AI with bluffing & position play', color: 'from-purple-600 to-purple-700 border-purple-500/50' },
];

export default function StartScreen({
  difficulty,
  highScore,
  soundEnabled,
  onStart,
  onSetDifficulty,
  onToggleSound,
}: StartScreenProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050c1a] via-[#0a1628] to-[#050c1a]" />

      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-600 blur-[120px]"
        />
      </div>

      {/* Floating card decorations */}
      {['♠', '♥', '♦', '♣'].map((suit, i) => (
        <motion.div
          key={suit}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.04, 0.1, 0.04],
            y: [0, -20, 0],
            rotate: [0, i % 2 === 0 ? 15 : -15, 0],
          }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}
          className={`absolute text-[120px] font-black select-none
            ${i < 2 ? 'text-red-500' : 'text-white'}
            ${i === 0 ? 'top-10 left-10' : i === 1 ? 'top-10 right-10' : i === 2 ? 'bottom-10 left-10' : 'bottom-10 right-10'}
          `}
        >
          {suit}
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md gap-6">

        {/* Logo / Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center"
        >
          <div className="text-6xl sm:text-7xl mb-2 select-none">🃏</div>
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent tracking-tight">
            PokerNeon
          </h1>
          <p className="text-white/40 text-sm mt-1 tracking-wider uppercase">
            Texas Hold'em
          </p>
        </motion.div>

        {/* High score */}
        {highScore > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5"
          >
            <span className="text-yellow-400 text-sm">🏆</span>
            <span className="text-yellow-400/80 text-xs font-medium">Best: </span>
            <span className="text-yellow-400 font-bold text-sm">{highScore.toLocaleString()} chips</span>
          </motion.div>
        )}

        {/* Difficulty selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full"
        >
          <p className="text-white/40 text-xs uppercase tracking-widest text-center mb-3">Select Difficulty</p>
          <div className="flex flex-col gap-2">
            {DIFFICULTIES.map(d => (
              <motion.button
                key={d.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSetDifficulty(d.id)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl border font-bold text-sm text-white
                  bg-gradient-to-r transition-all duration-150 cursor-pointer
                  ${difficulty === d.id
                    ? d.color + ' shadow-[0_0_20px_rgba(0,0,0,0.3)]'
                    : 'from-white/5 to-white/5 border-white/10 hover:border-white/20'
                  }
                `}
              >
                <div className="text-left">
                  <div>{d.label}</div>
                  <div className={`text-xs font-normal mt-0.5 ${difficulty === d.id ? 'text-white/70' : 'text-white/30'}`}>
                    {d.description}
                  </div>
                </div>
                {difficulty === d.id && <span className="text-base">✓</span>}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Start button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(34,211,238,0.4)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full py-4 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all"
        >
          Deal Me In 🃏
        </motion.button>

        {/* Sound toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2"
        >
          <button
            onClick={onToggleSound}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 text-xs transition-colors px-3 py-2 rounded-xl hover:bg-white/5"
          >
            <span className="text-base">{soundEnabled ? '🔊' : '🔇'}</span>
            <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
          </button>
        </motion.div>

        {/* Controls hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-white/20 text-xs space-y-0.5"
        >
          <p>Starting chips: 1,000 each &bull; Big blind: 20</p>
          <p>Defeat the AI by taking all its chips</p>
        </motion.div>
      </div>
    </div>
  );
}
