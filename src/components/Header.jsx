import React from 'react';
import { clsx } from 'clsx';

export default function Header({ soundOn, onToggleSound, onNewGame, onHome, onHowToPlay, status, onPause, onResume }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1.5rem',
      background: 'rgba(0,0,0,0.35)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexWrap: 'wrap',
      gap: '0.75rem',
    }}>
      <button
        onClick={onHome}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        title="Home"
        aria-label="Go to Home"
      >
        <span style={{
          fontFamily: "'Righteous', cursive",
          fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
          letterSpacing: '0.15em',
          background: 'linear-gradient(135deg, #b57bee, #ec4899, #06b6d4)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.4))',
        }}>
          BINGO
        </span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {onHowToPlay && (
          <button className="btn btn-secondary btn-sm" onClick={onHowToPlay} aria-label="How to Play">
            How to Play
          </button>
        )}
        {status === 'playing' && onPause && (
          <button className="btn btn-secondary btn-sm" onClick={onPause} aria-label="Pause Game">
            ⏸ Pause
          </button>
        )}
        {status === 'paused' && onResume && (
          <button className="btn btn-yellow btn-sm" onClick={onResume} aria-label="Resume Game">
            ▶ Resume
          </button>
        )}
        {onNewGame && (
          <button className="btn btn-secondary btn-sm" onClick={onNewGame} aria-label="New Game">
            🔄 New Game
          </button>
        )}
        <button
          className={clsx('btn btn-sm', soundOn ? 'btn-cyan' : 'btn-secondary')}
          onClick={onToggleSound}
          aria-label={soundOn ? 'Mute sounds' : 'Enable sounds'}
          title={soundOn ? 'Sound On – click to mute' : 'Sound Off – click to enable'}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
      </div>
    </header>
  );
}
