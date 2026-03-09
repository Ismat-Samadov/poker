'use client';
// Main game board — orchestrates all in-game UI
import { AnimatePresence, motion } from 'framer-motion';
import type { GameState } from '@/types/poker';
import PlayerHand from './PlayerHand';
import CommunityCards from './CommunityCards';
import PotDisplay from './PotDisplay';
import BettingControls from './BettingControls';
import EndScreen from './EndScreen';
import type { PlayerAction } from '@/types/poker';

interface GameBoardProps {
  state: GameState;
  canCheck: boolean;
  canCall: boolean;
  callAmount: number;
  minRaise: number;
  onAction: (action: PlayerAction, raiseAmount?: number) => void;
  onNextRound: () => void;
  onMenu: () => void;
  onTogglePause: () => void;
  onToggleSound: () => void;
}

export default function GameBoard({
  state,
  canCheck,
  canCall,
  callAmount,
  minRaise,
  onAction,
  onNextRound,
  onMenu,
  onTogglePause,
  onToggleSound,
}: GameBoardProps) {
  const { phase, player, ai, communityCards, pot, currentBet, isPlayerTurn, winner, message, isPaused, soundEnabled, highScore, roundNumber } = state;

  const showEndScreen = phase === 'ended';
  const isShowdown = phase === 'showdown' || phase === 'ended';

  return (
    <div className="relative w-full h-full flex flex-col min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060d1f] via-[#0a1628] to-[#060d1f]" />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-emerald-900/20 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-cyan-900/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-900/10 blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/5">
        <button
          onClick={onMenu}
          className="text-white/40 hover:text-white/70 text-xs font-medium transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
        >
          ← Menu
        </button>

        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <span className="text-yellow-400/70">High Score:</span>
          <span className="font-bold text-yellow-400">{highScore.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute' : 'Unmute'}
            className="text-white/40 hover:text-white/70 text-base transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          {/* Pause toggle */}
          <button
            onClick={onTogglePause}
            title={isPaused ? 'Resume' : 'Pause'}
            className="text-white/40 hover:text-white/70 text-sm transition-colors px-2 py-1 rounded-lg hover:bg-white/5 font-mono"
          >
            {isPaused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      {/* Pause overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="text-5xl mb-3">⏸</div>
              <h2 className="text-2xl font-black text-white mb-1">Paused</h2>
              <p className="text-white/50 text-sm mb-6">Game is paused</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onTogglePause}
                className="px-8 py-3 rounded-xl bg-gradient-to-b from-cyan-600 to-cyan-700 border border-cyan-500/40 font-bold text-white"
              >
                Resume
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 flex flex-col flex-1 px-4 py-2 gap-3 sm:gap-4 items-center justify-between max-w-2xl mx-auto w-full">

        {/* ── AI side ── */}
        <div className="w-full flex justify-center pt-2">
          <PlayerHand
            player={ai}
            label="AI Opponent"
            isActive={!isPlayerTurn && phase !== 'ended' && phase !== 'showdown'}
            showChips
            handDescription={isShowdown ? ai.handResult?.description : undefined}
            isWinner={winner === 'ai'}
          />
        </div>

        {/* ── Table center ── */}
        <div className="w-full flex flex-col items-center gap-3">
          {/* Poker table oval */}
          <div className="relative w-full">
            <div className="mx-auto max-w-md rounded-[48px] bg-gradient-to-b from-emerald-900/60 to-emerald-950/60 border border-emerald-700/30 p-4 sm:p-6 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]">
              {/* Table felt texture lines */}
              <div
                className="absolute inset-3 rounded-[40px] opacity-5 pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(255,255,255,0.3) 15px, rgba(255,255,255,0.3) 16px)',
                }}
              />

              {/* Pot display */}
              <div className="relative z-10 flex justify-center mb-4">
                <PotDisplay
                  pot={pot}
                  currentBet={currentBet}
                  phase={phase}
                  roundNumber={roundNumber}
                />
              </div>

              {/* Community cards */}
              <div className="relative z-10 flex justify-center">
                <CommunityCards cards={communityCards} />
              </div>
            </div>
          </div>

          {/* Status message */}
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                key={message}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-white/40 text-center"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Player side ── */}
        <div className="w-full flex flex-col items-center gap-3 pb-3">
          <PlayerHand
            player={player}
            label="You"
            isActive={isPlayerTurn && phase !== 'ended'}
            showChips
            handDescription={isShowdown ? player.handResult?.description : undefined}
            isWinner={winner === 'player'}
          />

          {/* Betting controls */}
          <AnimatePresence>
            {phase !== 'ended' && phase !== 'showdown' && phase !== 'dealing' && (
              <BettingControls
                canCheck={canCheck}
                canCall={canCall}
                callAmount={callAmount}
                playerChips={player.chips}
                minRaise={minRaise}
                currentBet={currentBet}
                playerBet={player.bet}
                isPlayerTurn={isPlayerTurn}
                isPaused={isPaused}
                onAction={onAction}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* End screen overlay */}
      <AnimatePresence>
        {showEndScreen && (
          <EndScreen state={state} onNextRound={onNextRound} onMenu={onMenu} />
        )}
      </AnimatePresence>
    </div>
  );
}
