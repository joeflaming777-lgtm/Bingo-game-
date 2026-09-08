// ============================================================
//  bingoUtils.js  –  Core Bingo game logic helpers
// ============================================================

export const COLUMNS = ['B', 'I', 'N', 'G', 'O'];

// Column ranges: B=1-15, I=16-30, N=31-45, G=46-60, O=61-75
export const COLUMN_RANGES = {
  B: { min: 1,  max: 15 },
  I: { min: 16, max: 30 },
  N: { min: 31, max: 45 },
  G: { min: 46, max: 60 },
  O: { min: 61, max: 75 },
};

/**
 * Get the letter prefix for a number (1-75)
 */
export function getLetterForNumber(num) {
  if (num <= 15) return 'B';
  if (num <= 30) return 'I';
  if (num <= 45) return 'N';
  if (num <= 60) return 'G';
  return 'O';
}

/**
 * Pick `count` unique random integers in [min, max] inclusive
 */
function sampleUnique(min, max, count) {
  const pool = [];
  for (let i = min; i <= max; i++) pool.push(i);
  // Fisher-Yates shuffle on pool, take first `count`
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/**
 * Generate a standard 5x5 Bingo card.
 * Returns a 2D array [row][col] with { value, isFree }
 * The center square (row=2, col=2) is the FREE space.
 */
export function generateBingoCard() {
  const columns = COLUMNS.map((letter, colIdx) => {
    const { min, max } = COLUMN_RANGES[letter];
    return sampleUnique(min, max, 5);
  });

  // Build card as [row][col]
  const card = [];
  for (let row = 0; row < 5; row++) {
    card.push([]);
    for (let col = 0; col < 5; col++) {
      const isFree = row === 2 && col === 2;
      card[row].push({
        value: isFree ? 'FREE' : columns[col][row],
        isFree,
        col,
        row,
      });
    }
  }
  return card;
}

/**
 * Build the initial marked set for a card.
 * FREE space is always pre-marked.
 */
export function getInitialMarked() {
  // Key: 'FREE'
  return new Set(['FREE']);
}

/**
 * Draw a random uncalled number from 1-75.
 * Returns { letter, number, label } or null if all called.
 */
export function callNumber(calledNumbers) {
  const all = [];
  for (let i = 1; i <= 75; i++) all.push(i);
  const remaining = all.filter(n => !calledNumbers.includes(n));
  if (remaining.length === 0) return null;
  const num = remaining[Math.floor(Math.random() * remaining.length)];
  const letter = getLetterForNumber(num);
  return { letter, number: num, label: `${letter}-${num}` };
}

/**
 * Check whether a card has Bingo.
 * `marked` is a Set of values (numbers + 'FREE').
 * Returns { hasBingo, winningLines } where winningLines is array of arrays of {row,col}.
 */
export function checkBingo(card, marked) {
  const winningLines = [];

  const isMarked = (r, c) => {
    const cell = card[r][c];
    return cell.isFree || marked.has(cell.value);
  };

  // Check rows
  for (let r = 0; r < 5; r++) {
    if ([0,1,2,3,4].every(c => isMarked(r, c))) {
      winningLines.push([0,1,2,3,4].map(c => ({ row: r, col: c })));
    }
  }
  // Check columns
  for (let c = 0; c < 5; c++) {
    if ([0,1,2,3,4].every(r => isMarked(r, c))) {
      winningLines.push([0,1,2,3,4].map(r => ({ row: r, col: c })));
    }
  }
  // Check main diagonal (top-left to bottom-right)
  if ([0,1,2,3,4].every(i => isMarked(i, i))) {
    winningLines.push([0,1,2,3,4].map(i => ({ row: i, col: i })));
  }
  // Check anti-diagonal (top-right to bottom-left)
  if ([0,1,2,3,4].every(i => isMarked(i, 4 - i))) {
    winningLines.push([0,1,2,3,4].map(i => ({ row: i, col: 4 - i })));
  }

  return { hasBingo: winningLines.length > 0, winningLines };
}

/**
 * Count how many complete lines a card has.
 */
export function countCompletedLines(card, marked) {
  const { winningLines } = checkBingo(card, marked);
  return winningLines.length;
}

/**
 * Get winning cell keys (Set of "row-col") for quick lookup.
 */
export function getWinningCellKeys(winningLines) {
  const keys = new Set();
  winningLines.forEach(line => line.forEach(({ row, col }) => keys.add(`${row}-${col}`)));
  return keys;
}

/**
 * Group called numbers by letter for the Called Numbers board.
 */
export function groupCalledByLetter(calledNumbers) {
  const groups = { B: [], I: [], N: [], G: [], O: [] };
  calledNumbers.forEach(n => {
    const letter = getLetterForNumber(n);
    groups[letter].push(n);
  });
  return groups;
}

/**
 * Reset to a fresh game state object.
 */
export function createFreshGameState(players, mode) {
  return {
    mode, // 'single' | 'two'
    players: players.map((name, idx) => ({
      id: idx,
      name,
      card: generateBingoCard(),
      marked: ['FREE'],
    })),
    calledNumbers: [],
    currentCall: null,
    status: 'playing', // 'playing' | 'paused' | 'won'
    winnerId: null,
    winningLines: [],
  };
}
