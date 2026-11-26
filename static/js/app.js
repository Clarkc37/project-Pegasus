/**
 * Global Guide Racing — Utility helpers (legacy, kept for reference)
 * Core helpers inlined in racecard-loader.js — this file is supplemental.
 */

/**
  const n = Number(odds);
  if (!n || n <= 0) return '-';
  return n < 2 ? `${(n * 100).toFixed(0)}%` : `${n.toFixed(1)}`;
}

function formatTime(time) {
  if (!time) return '';
  const s = String(time).padStart(4, '0');
  return `${s.slice(0, 2)}:${s.slice(2)}`;
}

function getDateString(d) {
  return d.toISOString().slice(0, 10);
}

function todayStr() {
  return getDateString(new Date());
}
