import React from 'react';

export default function HowToPlay({ onClose }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="htp-title">
      <div className="modal-box" style={{ maxWidth: '540px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 id="htp-title" style={{ fontFamily: "'Righteous', cursive", fontSize: '1.8rem' }}>
            📖 How to Play
          </h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose} aria-label="Close how to play">✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.95rem' }}>
          {steps.map(({ icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontWeight: 800, marginBottom: '0.2rem' }}>{title}</div>
                <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}

          {/* Card layout */}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '1rem', marginTop: '0.25rem' }}>
            <div style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Card Layout</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', maxWidth: '240px', margin: '0 auto' }}>
              {['B','I','N','G','O'].map((l, i) => (
                <div key={l} style={{
                  background: ['#8b5cf6','#06b6d4','#f59e0b','#10b981','#ec4899'][i],
                  borderRadius: '6px',
                  textAlign: 'center',
                  padding: '0.4rem',
                  fontFamily: "'Righteous', cursive",
                  fontWeight: 900,
                  color: '#fff',
                  fontSize: '1rem',
                }}>
                  {l}
                </div>
              ))}
              {[
                '1–15','16–30','31–45','46–60','61–75',
                '1–15','16–30','31–45','46–60','61–75',
                '1–15','16–30','FREE','46–60','61–75',
                '1–15','16–30','31–45','46–60','61–75',
                '1–15','16–30','31–45','46–60','61–75',
              ].map((t, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: '6px',
                  textAlign: 'center',
                  padding: '0.35rem 0.1rem',
                  fontSize: '0.55rem',
                  fontWeight: t === 'FREE' ? 900 : 600,
                  color: t === 'FREE' ? '#f59e0b' : 'var(--text-muted)',
                }}>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Winning patterns */}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Winning Patterns</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['Any Row →', 'Any Column ↓', 'Main Diagonal ↘', 'Anti-Diagonal ↙'].map(p => (
                <span key={p} style={{
                  background: 'rgba(139,92,246,0.2)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  borderRadius: '99px',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#c4b5fd',
                }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '1.5rem', width: '100%' }} id="htp-close-btn">
          Got it! Let's Play 🎱
        </button>
      </div>
    </div>
  );
}

const steps = [
  { icon: '🎴', title: 'Get Your Card', desc: 'You receive a random 5×5 Bingo card. The center square is always a FREE space.' },
  { icon: '🎱', title: 'Call Numbers', desc: 'Press "Call Number" to draw a random number from 1–75. Each number is only called once.' },
  { icon: '✅', title: 'Mark Your Card', desc: 'When a number appears on your card, click it to mark (daub) it. Numbers can only be marked after they\'ve been called.' },
  { icon: '🏆', title: 'Win!', desc: 'Be the first to complete a full row, column, or diagonal. The game will automatically detect and celebrate your win!' },
  { icon: '🤖', title: 'Auto-Call', desc: 'Enable Auto-Call to let the game draw numbers automatically at your chosen speed.' },
  { icon: '👥', title: 'Two Players', desc: 'In two-player mode, each player has their own card. Mark your own card and race to get Bingo first!' },
];
