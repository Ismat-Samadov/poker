'use client';
// Root page — routes between start screen and game board
import { AnimatePresence } from 'framer-motion';
import { usePokerGame } from '@/hooks/usePokerGame';
import StartScreen from '@/components/screens/StartScreen';
import GameBoard from '@/components/game/GameBoard';

export default function Home() {
  const {
    state,
    canCheck,
    canCall,
    callAmount,
    minRaise,
    startGame,
    playerAction,
    nextRound,
    toggleSound,
    togglePause,
    returnToMenu,
    setDifficulty,
  } = usePokerGame();

  const isInGame = state.phase !== 'menu';

  return (
    <main className="min-h-screen w-full game-board">
      <AnimatePresence mode="wait">
        {!isInGame ? (
          <StartScreen
            key="menu"
            difficulty={state.difficulty}
            highScore={state.highScore}
            soundEnabled={state.soundEnabled}
            onStart={startGame}
            onSetDifficulty={setDifficulty}
            onToggleSound={toggleSound}
          />
        ) : (
          <GameBoard
            key="game"
            state={state}
            canCheck={canCheck}
            canCall={canCall}
            callAmount={callAmount}
            minRaise={minRaise}
            onAction={playerAction}
            onNextRound={nextRound}
            onMenu={returnToMenu}
            onTogglePause={togglePause}
            onToggleSound={toggleSound}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
