import React from 'react';

const COLUMNS = ['B', 'I', 'N', 'G', 'O'];
const RANGES = { B: [1,15], I: [16,30], N: [31,45], G: [46,60], O: [61,75] };
const COL_COLORS = { B: '#8b5cf6', I: '#06b6d4', N: '#f59e0b', G: '#10b981', O: '#ec4899' };

export default function CalledNumbers({ calledNumbers, currentCall }) {
  const calledSet = new Set(calledNumbers);

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
        Called Numbers
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {COLUMNS.map(letter => {
          const [min, max] = RANGES[letter];
          const nums = [];
          for (let i = min; i <= max; i++) nums.push(i);
          const color = COL_COLORS[letter];

          return (
            <div key={letter} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {/* Letter label */}
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Righteous', cursive",
                fontWeight: 900,
                fontSize: '0.8rem',
                color: '#fff',
                flexShrink: 0,
              }}>
                {letter}
              </div>

              {/* Number chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                {nums.map(n => {
                  const isCalled = calledSet.has(n);
                  const isLatest = currentCall?.number === n;
                  return (
                    <div
                      key={n}
                      className={`num-chip${isCalled ? ' called' : ''}${isLatest ? ' latest' : ''}`}
                      aria-label={`${letter} ${n}${isCalled ? ', called' : ''}`}
                      style={{
                        background: isCalled ? color : undefined,
                        boxShadow: isLatest ? `0 0 10px ${color}` : undefined,
                        border: isLatest ? `2px solid #fff` : undefined,
                        transform: isLatest ? 'scale(1.15)' : undefined,
                        zIndex: isLatest ? 1 : undefined,
                        color: isCalled ? '#fff' : undefined,
                      }}
                    >
                      {n}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
