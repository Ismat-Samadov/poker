'use client';
// Player betting controls with raise slider
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { PlayerAction } from '@/types/poker';

interface BettingControlsProps {
  canCheck: boolean;
  canCall: boolean;
  callAmount: number;
  playerChips: number;
  minRaise: number;
  currentBet: number;
  playerBet: number;
  isPlayerTurn: boolean;
  isPaused: boolean;
  onAction: (action: PlayerAction, raiseAmount?: number) => void;
}

export default function BettingControls({
  canCheck,
  canCall,
  callAmount,
  playerChips,
  minRaise,
  currentBet,
  playerBet,
  isPlayerTurn,
  isPaused,
  onAction,
}: BettingControlsProps) {
  const [raiseAmount, setRaiseAmount] = useState(minRaise);
  const [showRaise, setShowRaise] = useState(false);

  const maxRaise = playerChips;
  const disabled = !isPlayerTurn || isPaused;

  const handleRaise = useCallback(() => {
    onAction('raise', raiseAmount);
    setShowRaise(false);
    setRaiseAmount(minRaise);
  }, [onAction, raiseAmount, minRaise]);

  const handleAllIn = useCallback(() => {
    onAction('allin');
    setShowRaise(false);
  }, [onAction]);

  if (!isPlayerTurn) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 text-white/40 text-sm"
      >
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        AI is thinking…
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-3 w-full max-w-sm"
    >
      {/* Raise slider (shown when raise panel is open) */}
      {showRaise && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="w-full bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-3"
        >
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Raise by</span>
            <span className="text-purple-300 font-bold">{raiseAmount}</span>
          </div>
          <input
            type="range"
            min={minRaise}
            max={maxRaise}
            step={minRaise}
            value={raiseAmount}
            onChange={e => setRaiseAmount(Number(e.target.value))}
            className="w-full h-1.5 appearance-none rounded-full cursor-pointer accent-purple-500"
            style={{
              background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${((raiseAmount - minRaise) / (maxRaise - minRaise)) * 100}%, rgba(255,255,255,0.1) ${((raiseAmount - minRaise) / (maxRaise - minRaise)) * 100}%, rgba(255,255,255,0.1) 100%)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-white/30 mt-1">
            <span>{minRaise}</span>
            <span>{maxRaise}</span>
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {/* Fold */}
        <ActionButton
          label="Fold"
          color="red"
          onClick={() => onAction('fold')}
          disabled={disabled}
          emoji="✕"
        />

        {/* Check or Call */}
        {canCheck ? (
          <ActionButton
            label="Check"
            color="gray"
            onClick={() => onAction('check')}
            disabled={disabled}
            emoji="✓"
          />
        ) : (
          <ActionButton
            label={`Call ${callAmount}`}
            color="blue"
            onClick={() => onAction('call')}
            disabled={disabled || !canCall}
            emoji="↑"
          />
        )}

        {/* Raise */}
        {playerChips > minRaise && (
          <ActionButton
            label={showRaise ? `Raise +${raiseAmount}` : 'Raise'}
            color="purple"
            onClick={showRaise ? handleRaise : () => setShowRaise(true)}
            disabled={disabled}
            emoji="▲"
          />
        )}

        {/* All In */}
        <ActionButton
          label="All In"
          color="orange"
          onClick={handleAllIn}
          disabled={disabled}
          emoji="⚡"
        />
      </div>
    </motion.div>
  );
}

interface ActionButtonProps {
  label: string;
  color: 'red' | 'gray' | 'blue' | 'purple' | 'orange';
  onClick: () => void;
  disabled: boolean;
  emoji: string;
}

const colorMap = {
  red: 'from-red-600 to-red-700 border-red-500/50 hover:from-red-500 hover:to-red-600 hover:shadow-[0_0_16px_rgba(239,68,68,0.4)]',
  gray: 'from-slate-600 to-slate-700 border-slate-500/50 hover:from-slate-500 hover:to-slate-600 hover:shadow-[0_0_16px_rgba(148,163,184,0.3)]',
  blue: 'from-blue-600 to-blue-700 border-blue-500/50 hover:from-blue-500 hover:to-blue-600 hover:shadow-[0_0_16px_rgba(59,130,246,0.4)]',
  purple: 'from-purple-600 to-purple-700 border-purple-500/50 hover:from-purple-500 hover:to-purple-600 hover:shadow-[0_0_16px_rgba(168,85,247,0.4)]',
  orange: 'from-orange-500 to-orange-600 border-orange-400/50 hover:from-orange-400 hover:to-orange-500 hover:shadow-[0_0_16px_rgba(249,115,22,0.5)]',
};

function ActionButton({ label, color, onClick, disabled, emoji }: ActionButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-1.5 px-4 py-2.5 rounded-xl border font-bold text-sm text-white
        bg-gradient-to-b transition-all duration-150 cursor-pointer
        disabled:opacity-30 disabled:cursor-not-allowed
        ${colorMap[color]}
      `}
    >
      <span className="text-base leading-none">{emoji}</span>
      <span>{label}</span>
    </motion.button>
  );
}
