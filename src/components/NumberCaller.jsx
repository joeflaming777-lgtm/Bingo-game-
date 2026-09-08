import React, { useEffect, useRef, useState } from 'react';

const LETTER_COLORS = {
  B: '#8b5cf6',
  I: '#06b6d4',
  N: '#f59e0b',
  G: '#10b981',
  O: '#ec4899',
};

export default function NumberCaller({
  currentCall,
  calledNumbers,
  onCallNumber,
  gameStatus,
  autoCall,
  onToggleAutoCall,
  autoSpeed,
  onSpeedChange,
}) {
  const total = 75;
  const remaining = total - calledNumbers.length;
  const canCall = gameStatus === 'playing' && remaining > 0;

  const letter = currentCall?.letter;
  const bgColor = letter ? LETTER_COLORS[letter] : '#8b5cf6';

  return (
    <div
      className="glass"
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}
    >
      <h2 style={{
        fontFamily: "'Righteous', cursive",
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: 'var(--text-muted)',
      }}>
        Number Called
      </h2>

      {/* Ball display */}
      {currentCall ? (
        <div
          key={currentCall.number}
          className="caller-ball"
          style={{ background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.4), ${bgColor})`, boxShadow: `0 0 40px ${bgColor}80, inset 0 4px 12px rgba(255,255,255,0.2)` }}
          aria-live="polite"
          aria-label={`Called number: ${currentCall.letter} ${currentCall.number}`}
        >
          <span className="ball-letter">{currentCall.letter}</span>
          <span className="ball-number">{currentCall.number}</span>
        </div>
      ) : (
        <div
          className="caller-ball"
          style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'none', border: '2px dashed rgba(255,255,255,0.15)' }}
          aria-label="No number called yet"
        >
          <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>?</span>
        </div>
      )}

      {/* Counts */}
      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
        <span>Called: <span style={{ color: '#fff' }}>{calledNumbers.length}</span></span>
        <span>Left: <span style={{ color: '#fff' }}>{remaining}</span></span>
      </div>

      {/* Call button */}
      <button
        id="call-number-btn"
        className="btn btn-primary btn-lg"
        onClick={onCallNumber}
        disabled={!canCall || autoCall}
        aria-label="Call next Bingo number"
        style={{ width: '100%', fontSize: '1.1rem' }}
      >
        🎱 Call Number
      </button>

      {/* Auto-call toggle */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Auto-Call</span>
          <button
            className={`btn btn-sm ${autoCall ? 'btn-yellow' : 'btn-secondary'}`}
            onClick={onToggleAutoCall}
            disabled={!canCall && !autoCall}
            aria-pressed={autoCall}
            id="auto-call-btn"
          >
            {autoCall ? '⏸ Stop' : '▶ Auto'}
          </button>
        </div>
        {autoCall && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Speed:</span>
            <input
              type="range"
              min={1}
              max={5}
              value={autoSpeed}
              onChange={e => onSpeedChange(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--purple)' }}
              aria-label="Auto-call speed"
            />
            <span>{['Slow', 'Med-Slow', 'Med', 'Med-Fast', 'Fast'][autoSpeed - 1]}</span>
          </div>
        )}
      </div>

      {/* All called */}
      {remaining === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>
          All 75 numbers have been called!
        </p>
      )}
    </div>
  );
}
