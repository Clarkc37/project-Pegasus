/** 
 * Global Guide Racing — Utility helpers
 * Shared fetch + formatting functions used by Alpine components.
 */

const R2_BASE = '/data/racecards/';
const LOCAL_BASE = '/racecards/';

/**
 * Fetch JSON from the R2 proxy, falling back to local static path for dev.
 */
async function fetchJSON(dateStr, filename) {
  const r2Url = `${R2_BASE}${filename || dateStr + '.json'}`;
  const localUrl = `${LOCAL_BASE}${filename || dateStr + '.json'}`;
  
  // Try R2 proxy first (production), then local static (dev server)
  try {
    const resp = await fetch(r2Url);
    if (resp.ok) return await resp.json();
  } catch (_) {}
  // Fallback to local static file
  try {
    const resp = await fetch(localUrl);
    if (resp.ok) return await resp.json();
  } catch (_) {}
  return null;
}

function formatOdds(odds) {
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
