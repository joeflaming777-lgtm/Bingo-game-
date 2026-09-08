import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function WinnerModal({ winner, winningLines, calledCount, onPlayAgain, onHome }) {
  const fired = useRef(false);

  useEffect(() => {
    if (!fired.current) {
      fired.current = true;
      const duration = 4000;
      const end = Date.now() + duration;

      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { x: Math.random(), y: Math.random() * 0.5 },
          colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ffffff'],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="winner-title">
      <div className="modal-box" style={{ textAlign: 'center', maxWidth: '460px' }}>
        {/* Trophy */}
        <div
          className="winner-glow"
          style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '1rem' }}
          aria-hidden="true"
        >
          🏆
        </div>

        {/* BINGO! */}
        <div style={{
          fontFamily: "'Righteous', cursive",
          fontSize: 'clamp(2.5rem, 8vw, 4rem)',
          letterSpacing: '0.2em',
          background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
        }}>
          BINGO!
        </div>

        <h2 id="winner-title" style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>
          🎉 {winner?.name} Wins!
        </h2>

        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Completed in <strong style={{ color: '#fff' }}>{calledCount}</strong> calls
          {winningLines?.length > 0 && (
            <> · <strong style={{ color: '#fff' }}>{winningLines.length}</strong> line{winningLines.length > 1 ? 's' : ''}</>
          )}
        </p>

        {/* Winning pattern description */}
        {winningLines?.length > 0 && (
          <div style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: '#fde68a',
          }}>
            {describeWinningLines(winningLines)}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={onPlayAgain} id="play-again-btn">
            🎮 Play Again
          </button>
          <button className="btn btn-secondary btn-lg" onClick={onHome} id="winner-home-btn">
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}

function describeWinningLines(winningLines) {
  const descs = winningLines.map(line => {
    const rows = [...new Set(line.map(c => c.row))];
    const cols = [...new Set(line.map(c => c.col))];
    if (rows.length === 1) return `Row ${rows[0] + 1}`;
    if (cols.length === 1) {
      const colNames = ['B', 'I', 'N', 'G', 'O'];
      return `Column ${colNames[cols[0]]}`;
    }
    const isMain = line.every(c => c.row === c.col);
    return isMain ? 'Main Diagonal ↘' : 'Anti-Diagonal ↙';
  });
  return `Winning: ${descs.join(' + ')}`;
}
