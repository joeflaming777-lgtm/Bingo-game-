import React, { useEffect, useRef } from 'react';
import { hasSavedGame } from '../utils/storageUtils';

const BALL_COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#f97316'];

function FloatingBalls() {
  return (
    <div className="balls-bg" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => {
        const size = 40 + Math.random() * 80;
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 12 + Math.random() * 10;
        const color = BALL_COLORS[i % BALL_COLORS.length];
        return (
          <div
            key={i}
            className="ball-float"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              background: `radial-gradient(circle at 35% 35%, white, ${color})`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function Home({ onStart, onHowToPlay, onResume }) {
  const saved = hasSavedGame();

  return (
    <div
      className="page-enter"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        textAlign: 'center',
        zIndex: 1,
      }}
    >
      <FloatingBalls />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px', width: '100%' }}>
        {/* Title */}
        <div style={{ marginBottom: '1rem' }}>
          <div className="bingo-title" style={{ fontFamily: "'Righteous', cursive" }}>
            BINGO
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: 600 }}>
            🎱 The Classic Number Game — Reimagined!
          </p>
        </div>

        {/* Card */}
        <div
          className="glass"
          style={{ padding: '2.5rem 2rem', marginTop: '2rem', boxShadow: 'var(--shadow-glow)' }}
        >
          {/* B I N G O letters with color */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            {[
              { l: 'B', c: 'var(--col-b)' },
              { l: 'I', c: 'var(--col-i)' },
              { l: 'N', c: 'var(--col-n)' },
              { l: 'G', c: 'var(--col-g)' },
              { l: 'O', c: 'var(--col-o)' },
            ].map(({ l, c }) => (
              <div
                key={l}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: `linear-gradient(145deg, ${c}, rgba(0,0,0,0.3))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Righteous', cursive",
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: '#fff',
                  boxShadow: `0 4px 16px ${c}55`,
                }}
              >
                {l}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn btn-primary btn-xl" onClick={onStart} id="start-game-btn">
              🎮 Start Game
            </button>

            {saved && (
              <button className="btn btn-green btn-lg" onClick={onResume} id="resume-game-btn">
                ♟ Continue Saved Game
              </button>
            )}

            <button className="btn btn-secondary btn-lg" onClick={onHowToPlay} id="how-to-play-btn">
              📖 How to Play
            </button>
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.3)', marginTop: '2rem', fontSize: '0.85rem' }}>
          Numbers 1–75 · Complete a row, column, or diagonal to win
        </p>
      </div>
    </div>
  );
}
