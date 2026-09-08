import React from 'react';
import BingoCell from './BingoCell';
import { getWinningCellKeys } from '../utils/bingoUtils';

const COLUMNS = ['B', 'I', 'N', 'G', 'O'];
const COL_COLORS = {
  B: '#8b5cf6',
  I: '#06b6d4',
  N: '#f59e0b',
  G: '#10b981',
  O: '#ec4899',
};

export default function BingoCard({ card, markedSet, winningLines, calledNumbers, onMarkCell, playerName, playerIdx, isActive = true }) {
  const winningCellKeys = getWinningCellKeys(winningLines || []);

  return (
    <div
      style={{ width: '100%' }}
      aria-label={`Bingo card for ${playerName}`}
    >
      {/* Player label */}
      {playerName && (
        <div style={{
          textAlign: 'center',
          marginBottom: '0.75rem',
          fontWeight: 800,
          fontSize: '1rem',
          color: playerIdx === 0 ? 'var(--col-b)' : 'var(--col-o)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {playerIdx === 0 ? '🟣' : '🩷'} {playerName}
        </div>
      )}

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '3px',
        marginBottom: '3px',
      }}>
        {COLUMNS.map(letter => (
          <div
            key={letter}
            className={`col-header-${letter}`}
            style={{
              textAlign: 'center',
              padding: '0.5rem 0',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontFamily: "'Righteous', cursive",
              fontSize: 'clamp(1rem, 3vw, 1.4rem)',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '0.1em',
            }}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '3px',
      }}>
        {card.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const key = `${rowIdx}-${colIdx}`;
            const isMarked = cell.isFree || markedSet.has(cell.value);
            const isWinning = winningCellKeys.has(key);
            return (
              <BingoCell
                key={key}
                cell={cell}
                isMarked={isMarked}
                isWinning={isWinning}
                calledNumbers={calledNumbers}
                onClick={() => isActive && onMarkCell && onMarkCell(cell.value)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
