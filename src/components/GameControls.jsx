import React from 'react';

export default function GameControls({ onNewGame, onRestart, onHome, onClearSave, gameStatus }) {
  return (
    <div className="glass" style={{ padding: '1.25rem' }}>
      <h2 style={{
        fontFamily: "'Righteous', cursive",
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: 'var(--text-muted)',
        marginBottom: '1rem',
        textAlign: 'center',
      }}>
        Controls
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <button className="btn btn-cyan" id="new-game-ctrl-btn" onClick={onNewGame}>
          🎮 New Game
        </button>
        <button className="btn btn-yellow" id="restart-game-btn" onClick={onRestart}>
          🔄 Restart
        </button>
        <button className="btn btn-secondary" id="home-btn" onClick={onHome}>
          🏠 Back to Home
        </button>
        {onClearSave && (
          <button className="btn btn-danger btn-sm" id="clear-save-btn" onClick={onClearSave}
            style={{ marginTop: '0.25rem' }}>
            🗑 Clear Saved Game
          </button>
        )}
      </div>
    </div>
  );
}
