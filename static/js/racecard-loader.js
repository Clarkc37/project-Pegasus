/**
 * Global Guide Racing — Alpine.js Components
 * Self-contained: all helpers inlined, no external deps.
 * Loads BEFORE Alpine CDN — registers components via `alpine:init` listener.
 */

// ── Utility helpers (global scope, no Alpine dependency) ──
const R2_BASE = '/data/racecards/';
const LOCAL_BASE = '/racecards/';

async function fetchJSON(dateStr, filename) {
  const r2Url = `${R2_BASE}${filename || dateStr + '.json'}`;
  const localUrl = `${LOCAL_BASE}${filename || dateStr + '.json'}`;
  try { const r = await fetch(r2Url); if (r.ok) return await r.json(); } catch (_) {}
  try { const r = await fetch(localUrl); if (r.ok) return await r.json(); } catch (_) {}
  return null;
}
function formatOdds(odds) { const n=Number(odds); return !n||n<=0?'-':n<2?`${(n*100).toFixed(0)}%`:`${n.toFixed(1)}`; }
function formatTime(t) { if(!t)return''; const s=String(t).padStart(4,'0'); return`${s.slice(0,2)}:${s.slice(2)}`; }
function getDateString(d) { return d.toISOString().slice(0,10); }
function todayStr() { return getDateString(new Date()); }

// ── Alpine component registrations (deferred) ─────────────
document.addEventListener('alpine:init', () => {

  /* ─── HOMEPAGE ─────────────────────────────────────── */
  Alpine.data('racecardApp', () => ({
    data: null,
    loading: true,
    error: null,
    date: todayStr(),

    init() { this.loadRaces(this.date); },

    async loadRaces(dateStr) {
      this.loading = true; this.error = null;
      const json = await fetchJSON(dateStr);
      if (!json) { this.error = 'No race data available for this date.'; this.loading = false; return; }
      this.data = json; this.loading = false;
    },

    prevDay() { const d = new Date(this.date); d.setDate(d.getDate() - 1); this.date = getDateString(d); this.loadRaces(this.date); },
    nextDay() { const d = new Date(this.date); d.setDate(d.getDate() + 1); this.date = getDateString(d); this.loadRaces(this.date); },
    goToday() { this.date = todayStr(); this.loadRaces(this.date); },

    get meetings() { return this.data || []; },
    get totalRaces() { return this.meetings.reduce((s, m) => s + (m.races?.length || 0), 0); }
  }));

  /* ─── RACECARD LIST ────────────────────────────────── */
  Alpine.data('racecardListApp', () => ({
    data: null, loading: true, error: null, date: todayStr(), expanded: {},
    init() { this.loadRaces(this.date); },
    async loadRaces(dateStr) { this.loading = true; this.error = null; const json = await fetchJSON(dateStr); if (!json) { this.error = 'No race data available.'; this.loading = false; return; } this.data = json; this.loading = false; },
    toggleCourse(idx) { this.expanded[idx] = !this.expanded[idx]; }
  }));

  /* ─── RACECARD DETAIL ──────────────────────────────── */
  Alpine.data('racecardDetailApp', () => ({
    data: null, loading: true, error: null, meetingIndex: 0, expandedHorses: {}, date: '', course: '',
    init() { const p = new URLSearchParams(window.location.search); this.date = p.get('date') || todayStr(); this.course = p.get('course') || ''; this.loadRacecard(this.date); },
    async loadRacecard(dateStr) { this.loading = true; this.error = null; const json = await fetchJSON(dateStr); if (!json) { this.error = 'Racecard not found.'; this.loading = false; return; } this.data = json; if (this.course) { const idx = json.findIndex(m => m.Course?.toLowerCase() === this.course.toLowerCase()); if (idx >= 0) this.meetingIndex = idx; } this.loading = false; },
    get meeting() { return this.data?.[this.meetingIndex] || null; },
    get races() { return this.meeting?.races || []; },
    toggleHorse(idx) { this.expandedHorses[idx] = !this.expandedHorses[idx]; },
    nextMeeting() { if (this.meetingIndex < (this.data?.length || 1) - 1) this.meetingIndex++; },
    prevMeeting() { if (this.meetingIndex > 0) this.meetingIndex--; }
  }));

  /* ─── FESTIVAL ─────────────────────────────────────── */
  Alpine.data('festivalApp', () => ({
    data: null, loading: true, error: null, activeDay: 1, days: ['Day 1','Day 2','Day 3','Day 4'],
    init() { this.loadFestival(); },
    async loadFestival() { this.loading = true; this.error = null; const json = await fetchJSON('', 'cheltenham.json'); if (!json) { this.error = 'Festival data not yet available.'; this.loading = false; return; } this.data = json; this.loading = false; },
    setDay(day) { this.activeDay = day; }
  }));
});
