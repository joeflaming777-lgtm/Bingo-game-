import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import PlayerSetup from './components/PlayerSetup';
import BingoCard from './components/BingoCard';
import NumberCaller from './components/NumberCaller';
import CalledNumbers from './components/CalledNumbers';
import GameStats from './components/GameStats';
import GameControls from './components/GameControls';
import WinnerModal from './components/WinnerModal';
import ConfirmModal from './components/ConfirmModal';
import HowToPlay from './components/HowToPlay';

import {
  createFreshGameState,
  callNumber,
  checkBingo,
  countCompletedLines,
} from './utils/bingoUtils';
import { saveGameState, loadGameState, clearGameState } from './utils/storageUtils';
import {
  setSoundEnabled,
  playClickSound,
  playDaubSound,
  playBallCallSound,
  playWinFanfare,
  playErrorSound,
} from './utils/audioUtils';

// Auto-call delays (ms) for speeds 1–5
const AUTO_SPEEDS = [4000, 3000, 2000, 1500, 800];

export default function App() {
  // ── View: 'home' | 'setup' | 'game' ──────────────────────
  const [view, setView] = useState('home');

  // ── Sound ─────────────────────────────────────────────────
  const [soundOn, setSoundOn] = useState(true);

  // ── Game state ────────────────────────────────────────────
  const [gameState, setGameState] = useState(null);
  /*
   * gameState shape:
   *   mode: 'single' | 'two'
   *   players: [{ id, name, card, marked: number[] }]
   *   calledNumbers: number[]
   *   currentCall: { letter, number, label } | null
   *   status: 'playing' | 'paused' | 'won'
   *   winnerId: number | null
   *   winningLines: []
   */

  // ── Auto-call ─────────────────────────────────────────────
  const [autoCall, setAutoCall] = useState(false);
  const [autoSpeed, setAutoSpeed] = useState(3);
  const autoCallTimer = useRef(null);

  // ── Modals ────────────────────────────────────────────────
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  // confirmModal: { title, message, confirmLabel, cancelLabel, onConfirm, danger }

  // ── Sound toggle ──────────────────────────────────────────
  function handleToggleSound() {
    setSoundOn(prev => {
      setSoundEnabled(!prev);
      return !prev;
    });
  }

  // ── Load saved game on mount ──────────────────────────────
  useEffect(() => {
    const saved = loadGameState();
    if (saved) {
      // Reconstruct Sets from arrays stored in JSON
      const reconstructed = {
        ...saved,
        players: saved.players.map(p => ({ ...p, marked: p.marked })),
      };
      setGameState(reconstructed);
    }
  }, []);

  // ── Save whenever game state changes ─────────────────────
  useEffect(() => {
    if (gameState) {
      saveGameState(gameState);
    }
  }, [gameState]);

  // ── Auto-call management ──────────────────────────────────
  const stopAutoCall = useCallback(() => {
    if (autoCallTimer.current) {
      clearTimeout(autoCallTimer.current);
      autoCallTimer.current = null;
    }
    setAutoCall(false);
  }, []);

  const scheduleNextCall = useCallback((gs, speed) => {
    if (autoCallTimer.current) clearTimeout(autoCallTimer.current);
    autoCallTimer.current = setTimeout(() => {
      setGameState(prev => {
        if (!prev || prev.status !== 'playing') { setAutoCall(false); return prev; }
        const remaining = 75 - prev.calledNumbers.length;
        if (remaining === 0) { setAutoCall(false); return prev; }
        return performCall(prev);
      });
    }, AUTO_SPEEDS[speed - 1]);
  }, []);

  useEffect(() => {
    if (autoCall && gameState && gameState.status === 'playing') {
      scheduleNextCall(gameState, autoSpeed);
    } else {
      if (autoCallTimer.current) clearTimeout(autoCallTimer.current);
    }
    return () => { if (autoCallTimer.current) clearTimeout(autoCallTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCall, autoSpeed, gameState?.calledNumbers?.length]);

  // ── Core: perform a number call ───────────────────────────
  function performCall(gs) {
    const result = callNumber(gs.calledNumbers);
    if (!result) {
      playErrorSound();
      return gs;
    }
    playBallCallSound();
    return {
      ...gs,
      calledNumbers: [...gs.calledNumbers, result.number],
      currentCall: result,
    };
  }

  function handleCallNumber() {
    if (!gameState || gameState.status !== 'playing') return;
    if (gameState.calledNumbers.length >= 75) { playErrorSound(); return; }
    playClickSound();
    setGameState(prev => performCall(prev));
  }

  // ── Core: mark a cell on a player's card ─────────────────
  function handleMarkCell(playerIdx, value) {
    if (!gameState || gameState.status !== 'playing') return;
    const player = gameState.players[playerIdx];
    if (!gameState.calledNumbers.includes(value)) return;
    if (player.marked.includes(value)) return;

    playDaubSound();

    setGameState(prev => {
      const newMarked = [...prev.players[playerIdx].marked, value];
      const markedSet = new Set(newMarked);

      const card = prev.players[playerIdx].card;
      const { hasBingo, winningLines } = checkBingo(card, markedSet);

      const newPlayers = prev.players.map((p, i) =>
        i === playerIdx ? { ...p, marked: newMarked } : p
      );

      if (hasBingo) {
        playWinFanfare();
        return {
          ...prev,
          players: newPlayers,
          status: 'won',
          winnerId: playerIdx,
          winningLines,
        };
      }

      return { ...prev, players: newPlayers };
    });
  }

  // ── Navigation helpers ────────────────────────────────────
  function goHome() {
    if (gameState && gameState.status === 'playing') {
      setConfirmModal({
        title: 'Leave Game?',
        message: 'Your current game will be saved. You can resume it later from the home screen.',
        confirmLabel: '🏠 Go Home',
        cancelLabel: 'Keep Playing',
        onConfirm: () => { stopAutoCall(); setConfirmModal(null); setView('home'); },
        danger: false,
      });
    } else {
      stopAutoCall();
      setView('home');
    }
  }

  function handleNewGame() {
    if (gameState && gameState.status === 'playing') {
      setConfirmModal({
        title: 'Start New Game?',
        message: 'Your current game progress will be lost.',
        confirmLabel: '🎮 New Game',
        cancelLabel: 'Keep Playing',
        onConfirm: () => { stopAutoCall(); setConfirmModal(null); setView('setup'); },
        danger: true,
      });
    } else {
      stopAutoCall();
      setView('setup');
    }
  }

  function handleRestart() {
    if (!gameState) return;
    setConfirmModal({
      title: 'Restart Game?',
      message: 'The board will be reset but same players will continue with new cards.',
      confirmLabel: '🔄 Restart',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        stopAutoCall();
        setConfirmModal(null);
        const fresh = createFreshGameState(
          gameState.players.map(p => p.name),
          gameState.mode
        );
        setGameState(fresh);
      },
      danger: false,
    });
  }

  function handleClearSave() {
    setConfirmModal({
      title: 'Clear Saved Game?',
      message: 'This will permanently delete the saved game state.',
      confirmLabel: '🗑 Clear',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        clearGameState();
        setGameState(null);
        setConfirmModal(null);
        setView('home');
      },
      danger: true,
    });
  }

  function handleStartGame(names, mode) {
    stopAutoCall();
    const fresh = createFreshGameState(names, mode);
    setGameState(fresh);
    setView('game');
  }

  function handleResumeGame() {
    if (gameState) setView('game');
  }

  function handlePlayAgain() {
    stopAutoCall();
    if (gameState) {
      const fresh = createFreshGameState(
        gameState.players.map(p => p.name),
        gameState.mode
      );
      setGameState(fresh);
    }
  }

  function handlePause() {
    stopAutoCall();
    setGameState(prev => prev ? { ...prev, status: 'paused' } : prev);
  }

  function handleResume() {
    setGameState(prev => prev ? { ...prev, status: 'playing' } : prev);
  }

  function handleToggleAutoCall() {
    if (autoCall) {
      stopAutoCall();
    } else {
      setAutoCall(true);
    }
  }

  // ── Derived values ────────────────────────────────────────
  const winner = gameState?.winnerId != null ? gameState.players[gameState.winnerId] : null;

  const completedLinesByPlayer = gameState?.players.map(p =>
    countCompletedLines(p.card, new Set(p.marked))
  );

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="app-bg">
      {/* Always-on header in game mode */}
      {view === 'game' && gameState && (
        <Header
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
          onNewGame={handleNewGame}
          onHome={goHome}
          onHowToPlay={() => setShowHowToPlay(true)}
          status={gameState.status}
          onPause={handlePause}
          onResume={handleResume}
        />
      )}

      {/* Views */}
      {view === 'home' && (
        <Home
          onStart={() => { playClickSound(); setView('setup'); }}
          onHowToPlay={() => setShowHowToPlay(true)}
          onResume={handleResumeGame}
        />
      )}

      {view === 'setup' && (
        <PlayerSetup
          onStart={handleStartGame}
          onBack={() => setView('home')}
        />
      )}

      {view === 'game' && gameState && (
        <GameView
          gameState={gameState}
          completedLinesByPlayer={completedLinesByPlayer}
          winner={winner}
          onCallNumber={handleCallNumber}
          onMarkCell={handleMarkCell}
          onPlayAgain={handlePlayAgain}
          onHome={goHome}
          onNewGame={handleNewGame}
          onRestart={handleRestart}
          onClearSave={handleClearSave}
          autoCall={autoCall}
          autoSpeed={autoSpeed}
          onToggleAutoCall={handleToggleAutoCall}
          onSpeedChange={setAutoSpeed}
        />
      )}

      {/* Modals */}
      {showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} />}
      {confirmModal && (
        <ConfirmModal
          {...confirmModal}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}

// ── Game View (extracted for readability) ─────────────────────
function GameView({
  gameState, completedLinesByPlayer, winner,
  onCallNumber, onMarkCell, onPlayAgain, onHome,
  onNewGame, onRestart, onClearSave,
  autoCall, autoSpeed, onToggleAutoCall, onSpeedChange,
}) {
  const isTwoPlayer = gameState.mode === 'two';

  return (
    <div className="page-enter" style={{ minHeight: 'calc(100vh - 56px)', padding: '1rem', position: 'relative', zIndex: 1 }}>
      {/* Winner modal */}
      {gameState.status === 'won' && winner && (
        <WinnerModal
          winner={winner}
          winningLines={gameState.winningLines}
          calledCount={gameState.calledNumbers.length}
          onPlayAgain={onPlayAgain}
          onHome={onHome}
        />
      )}

      <div style={{
        maxWidth: isTwoPlayer ? '1400px' : '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isTwoPlayer
          ? 'minmax(0,1fr) minmax(0,1fr) 320px'
          : '1fr 340px',
        gridTemplateRows: 'auto',
        gap: '1rem',
        alignItems: 'start',
      }}
      className="game-grid"
      >
        {/* ─ Card(s) ─ */}
        {isTwoPlayer ? (
          <>
            <PlayerCard
              player={gameState.players[0]}
              playerIdx={0}
              calledNumbers={gameState.calledNumbers}
              winningLines={gameState.status === 'won' && gameState.winnerId === 0 ? gameState.winningLines : []}
              onMarkCell={v => onMarkCell(0, v)}
              isActive={gameState.status === 'playing'}
            />
            <PlayerCard
              player={gameState.players[1]}
              playerIdx={1}
              calledNumbers={gameState.calledNumbers}
              winningLines={gameState.status === 'won' && gameState.winnerId === 1 ? gameState.winningLines : []}
              onMarkCell={v => onMarkCell(1, v)}
              isActive={gameState.status === 'playing'}
            />
          </>
        ) : (
          <PlayerCard
            player={gameState.players[0]}
            playerIdx={0}
            calledNumbers={gameState.calledNumbers}
            winningLines={gameState.status === 'won' ? gameState.winningLines : []}
            onMarkCell={v => onMarkCell(0, v)}
            isActive={gameState.status === 'playing'}
          />
        )}

        {/* ─ Sidebar ─ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <NumberCaller
            currentCall={gameState.currentCall}
            calledNumbers={gameState.calledNumbers}
            onCallNumber={onCallNumber}
            gameStatus={gameState.status}
            autoCall={autoCall}
            onToggleAutoCall={onToggleAutoCall}
            autoSpeed={autoSpeed}
            onSpeedChange={onSpeedChange}
          />
          <GameStats
            players={gameState.players}
            calledNumbers={gameState.calledNumbers}
            gameStatus={gameState.status}
            completedLinesByPlayer={completedLinesByPlayer}
          />
          <CalledNumbers
            calledNumbers={gameState.calledNumbers}
            currentCall={gameState.currentCall}
          />
          <GameControls
            onNewGame={onNewGame}
            onRestart={onRestart}
            onHome={onHome}
            onClearSave={onClearSave}
            gameStatus={gameState.status}
          />
        </div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          .game-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .game-grid { gap: 0.75rem !important; }
        }
      `}</style>
    </div>
  );
}

function PlayerCard({ player, playerIdx, calledNumbers, winningLines, onMarkCell, isActive }) {
  return (
    <div className="glass" style={{ padding: '1rem' }}>
      <BingoCard
        card={player.card}
        markedSet={new Set(player.marked)}
        winningLines={winningLines}
        calledNumbers={calledNumbers}
        onMarkCell={onMarkCell}
        playerName={player.name}
        playerIdx={playerIdx}
        isActive={isActive}
      />
    </div>
  );
}
