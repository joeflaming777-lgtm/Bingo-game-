import React from 'react';

export default function GameStats({ players, calledNumbers, gameStatus, completedLinesByPlayer }) {
  const remaining = 75 - calledNumbers.length;

  const statusLabel = {
    playing: { text: 'Playing', color: '#10b981' },
    paused:  { text: 'Paused',  color: '#f59e0b' },
    won:     { text: 'Winner!', color: '#ec4899' },
  }[gameStatus] || { text: 'Idle', color: '#94a3b8' };

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
        Game Stats
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="stat-card">
          <div className="stat-value">{calledNumbers.length}</div>
          <div className="stat-label">Called</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{remaining}</div>
          <div className="stat-label">Remaining</div>
        </div>
        <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontFamily: "'Righteous', cursive", fontSize: '1.5rem', fontWeight: 900, color: statusLabel.color }}>
            {statusLabel.text}
          </div>
          <div className="stat-label">Status</div>
        </div>

        {players.map((player, idx) => (
          <div className="stat-card" key={idx}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: idx === 0 ? 'var(--col-b)' : 'var(--col-o)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {player.name}
            </div>
            <div className="stat-value" style={{ fontSize: '1.4rem' }}>
              {completedLinesByPlayer?.[idx] ?? 0}
            </div>
            <div className="stat-label">Lines</div>
          </div>
        ))}
      </div>
    </div>
  );
}
