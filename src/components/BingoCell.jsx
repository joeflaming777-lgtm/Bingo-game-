import React, { useState } from 'react';
import { clsx } from 'clsx';

const COLUMNS = ['B', 'I', 'N', 'G', 'O'];
const COL_COLORS = {
  B: '#8b5cf6',
  I: '#06b6d4',
  N: '#f59e0b',
  G: '#10b981',
  O: '#ec4899',
};

export default function BingoCell({ cell, isMarked, isWinning, onClick, calledNumbers }) {
  const [animating, setAnimating] = useState(false);

  if (!cell) return null;

  const { value, isFree, col } = cell;
  const letter = COLUMNS[col];
  const colColor = COL_COLORS[letter];
  const isCalled = isFree || calledNumbers.includes(value);

  function handleClick() {
    if (isMarked || isFree || !isCalled) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
    onClick();
  }

  return (
    <button
      className={clsx(
        'bingo-cell',
        isFree && 'free',
        isMarked && !isFree && 'marked',
        isWinning && 'winning',
        animating && 'daub-anim',
        !isMarked && !isFree && isCalled && 'callable',
      )}
      onClick={handleClick}
      disabled={isMarked || isFree || !isCalled}
      aria-label={isFree ? 'Free Space' : `${letter} ${value}${isMarked ? ', marked' : ''}${isCalled ? ', called' : ''}`}
      aria-pressed={isMarked || isFree}
      style={{
        outline: !isMarked && !isFree && isCalled ? `2px solid ${colColor}55` : undefined,
        cursor: !isMarked && !isFree && isCalled ? 'pointer' : isMarked || isFree ? 'default' : 'not-allowed',
        opacity: !isMarked && !isFree && !isCalled ? 0.45 : 1,
      }}
    >
      {isFree ? (
        <span style={{ fontSize: '0.65em', letterSpacing: '0.05em', fontWeight: 900 }}>FREE</span>
      ) : (
        <span style={{ fontWeight: 900 }}>{value}</span>
      )}
    </button>
  );
}
