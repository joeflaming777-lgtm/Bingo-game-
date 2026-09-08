// ============================================================
//  storageUtils.js  –  LocalStorage helpers
// ============================================================

const KEY = 'bingo_game_state';

export function saveGameState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    // storage unavailable - ignore
  }
}

export function loadGameState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function clearGameState() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    // ignore
  }
}

export function hasSavedGame() {
  try {
    return !!localStorage.getItem(KEY);
  } catch (e) {
    return false;
  }
}
