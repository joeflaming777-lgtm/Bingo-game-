import React, { useState } from 'react';
import { User, Users } from 'lucide-react';

export default function PlayerSetup({ onStart, onBack }) {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [mode, setMode] = useState('single');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!player1.trim()) {
      setError('Please enter your name to start!');
      return;
    }
    if (mode === 'two' && !player2.trim()) {
      setError('Please enter Player 2\'s name!');
      return;
    }
    setError('');
    const names = mode === 'single' ? [player1.trim()] : [player1.trim(), player2.trim()];
    onStart(names, mode);
  }

  return (
    <div
      className="page-enter"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: '480px', width: '100%' }}>
        {/* Back */}
        <button className="btn btn-secondary btn-sm" onClick={onBack} style={{ marginBottom: '1.5rem' }}>
          ← Back
        </button>

        <div className="glass" style={{ padding: '2.5rem 2rem', boxShadow: 'var(--shadow-glow)' }}>
          <h1 style={{ fontFamily: "'Righteous', cursive", fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
            Player Setup
          </h1>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Configure your game before we begin
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Game Mode */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Game Mode
              </label>
              <div className="mode-toggle">
                <button
                  type="button"
                  className={mode === 'single' ? 'active' : ''}
                  onClick={() => setMode('single')}
                  aria-pressed={mode === 'single'}
                >
                  <User size={16} /> Single Player
                </button>
                <button
                  type="button"
                  className={mode === 'two' ? 'active' : ''}
                  onClick={() => setMode('two')}
                  aria-pressed={mode === 'two'}
                >
                  <Users size={16} /> Two Players
                </button>
              </div>
            </div>

            {/* Player 1 name */}
            <div>
              <label htmlFor="player1-name" style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {mode === 'single' ? 'Your Name' : 'Player 1 Name'}
              </label>
              <input
                id="player1-name"
                className="input"
                type="text"
                placeholder={mode === 'single' ? 'Enter your name…' : 'Player 1 name…'}
                value={player1}
                onChange={e => { setPlayer1(e.target.value); setError(''); }}
                maxLength={20}
                autoFocus
                autoComplete="off"
              />
            </div>

            {/* Player 2 name */}
            {mode === 'two' && (
              <div style={{ animation: 'slideUp 0.3s ease' }}>
                <label htmlFor="player2-name" style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Player 2 Name
                </label>
                <input
                  id="player2-name"
                  className="input"
                  type="text"
                  placeholder="Player 2 name…"
                  value={player2}
                  onChange={e => { setPlayer2(e.target.value); setError(''); }}
                  maxLength={20}
                  autoComplete="off"
                />
              </div>
            )}

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', color: '#fca5a5', fontSize: '0.9rem', fontWeight: 600 }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" id="start-bingo-btn">
              🎱 Start Bingo!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
