'use client';
// Animated end-of-round and game-over screen
import { motion } from 'framer-motion';
import type { GameState } from '@/types/poker';

interface EndScreenProps {
  state: GameState;
  onNextRound: () => void;
  onMenu: () => void;
}

export default function EndScreen({ state, onNextRound, onMenu }: EndScreenProps) {
  const { winner, winnerDescription, player, ai, pot, roundNumber, highScore, phase } = state;

  const isGameOver = player.chips <= 0 || ai.chips <= 0;
  const playerWon = winner === 'player';
  const tie = winner === 'tie';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Panel */}
      <div className={`relative z-10 rounded-2xl border p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl
        ${playerWon
          ? 'bg-gradient-to-b from-emerald-950 to-slate-950 border-emerald-500/40 shadow-emerald-500/20'
          : tie
          ? 'bg-gradient-to-b from-blue-950 to-slate-950 border-blue-500/40 shadow-blue-500/20'
          : 'bg-gradient-to-b from-red-950 to-slate-950 border-red-500/40 shadow-red-500/20'
        }`}
      >
        {/* Result emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
          className="text-6xl sm:text-7xl mb-3"
        >
          {playerWon ? '🏆' : tie ? '🤝' : '💸'}
        </motion.div>

        {/* Winner heading */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-xl sm:text-2xl font-black mb-1
            ${playerWon ? 'text-emerald-400' : tie ? 'text-blue-300' : 'text-red-400'}
          `}
        >
          {isGameOver
            ? (playerWon ? 'You Win the Game!' : 'Game Over')
            : (playerWon ? 'You Win!' : tie ? 'It\'s a Tie!' : 'AI Wins')}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-sm mb-4"
        >
          {winnerDescription}
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-black/30 rounded-xl p-3 mb-5 space-y-2 text-sm"
        >
          {pot > 0 && (
            <div className="flex justify-between text-white/70">
              <span>Pot won</span>
              <span className="text-yellow-400 font-bold">{pot}</span>
            </div>
          )}
          <div className="flex justify-between text-white/70">
            <span>Your chips</span>
            <span className={`font-bold ${player.chips > 1000 ? 'text-emerald-400' : player.chips < 1000 ? 'text-red-400' : 'text-white'}`}>
              {player.chips.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>AI chips</span>
            <span className="font-bold text-white/50">{ai.chips.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>High score</span>
            <span className="text-yellow-400 font-bold">{highScore.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Hands revealed */}
        {(state.player.handResult || state.ai.handResult) && !state.player.hasFolded && !state.ai.hasFolded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-white/40 mb-4 space-y-1"
          >
            {state.player.handResult && (
              <div>You: <span className="text-cyan-300">{state.player.handResult.description}</span></div>
            )}
            {state.ai.handResult && (
              <div>AI: <span className="text-purple-300">{state.ai.handResult.description}</span></div>
            )}
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          {!isGameOver ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextRound}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-b from-cyan-600 to-cyan-700 border border-cyan-500/40 text-white hover:from-cyan-500 hover:to-cyan-600 transition-all"
            >
              Next Round →
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenu}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-b from-cyan-600 to-cyan-700 border border-cyan-500/40 text-white hover:from-cyan-500 hover:to-cyan-600 transition-all"
            >
              Play Again
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenu}
            className="px-4 py-3 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all"
          >
            Menu
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
