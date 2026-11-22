/**
 * Global Guide Racing — Alpine.js Components
 * Uses fetchJSON() from app.js with R2 → local fallback.
 */

document.addEventListener('alpine:init', () => {

  /* ─── HOMEPAGE ─────────────────────────────────────── */
  Alpine.data('racecardApp', () => ({
    data: null,
    loading: true,
    error: null,
    date: todayStr(),
    viewDate: todayStr(),

    init() {
      this.loadRaces(this.date);
    },

    async loadRaces(dateStr) {
      this.loading = true;
      this.error = null;
      const json = await fetchJSON(dateStr);
      if (!json) {
        this.error = 'No race data available for this date.';
        this.loading = false;
        return;
      }
      this.data = json;
      this.loading = false;
    },

    prevDay() {
      const d = new Date(this.date);
      d.setDate(d.getDate() - 1);
      this.date = getDateString(d);
      this.loadRaces(this.date);
    },

    nextDay() {
      const d = new Date(this.date);
      d.setDate(d.getDate() + 1);
      this.date = getDateString(d);
      this.loadRaces(this.date);
    },

    goToday() {
      this.date = todayStr();
      this.loadRaces(this.date);
    },

    get meetings() {
      return this.data || [];
    },

    get totalRaces() {
      return this.meetings.reduce((s, m) => s + (m.races?.length || 0), 0);
    }
  }));

  /* ─── RACECARD LIST ────────────────────────────────── */
  Alpine.data('racecardListApp', () => ({
    data: null,
    loading: true,
    error: null,
    date: todayStr(),
    expanded: {},

    init() {
      this.loadRaces(this.date);
    },

    async loadRaces(dateStr) {
      this.loading = true;
      this.error = null;
      const json = await fetchJSON(dateStr);
      if (!json) {
        this.error = 'No race data available.';
        this.loading = false;
        return;
      }
      this.data = json;
      this.loading = false;
    },

    toggleCourse(idx) {
      this.expanded[idx] = !this.expanded[idx];
    }
  }));

  /* ─── RACECARD DETAIL ──────────────────────────────── */
  Alpine.data('racecardDetailApp', () => ({
    data: null,
    loading: true,
    error: null,
    meetingIndex: 0,
    expandedHorses: {},
    date: '',
    course: '',

    init() {
      const params = new URLSearchParams(window.location.search);
      this.date = params.get('date') || todayStr();
      this.course = params.get('course') || '';
      this.loadRacecard(this.date);
    },

    async loadRacecard(dateStr) {
      this.loading = true;
      this.error = null;
      const json = await fetchJSON(dateStr);
      if (!json) {
        this.error = 'Racecard not found.';
        this.loading = false;
        return;
      }
      this.data = json;
      if (this.course) {
        const idx = json.findIndex(m =>
          m.Course?.toLowerCase() === this.course.toLowerCase()
        );
        if (idx >= 0) this.meetingIndex = idx;
      }
      this.loading = false;
    },

    get meeting() {
      return this.data?.[this.meetingIndex] || null;
    },

    get races() {
      return this.meeting?.races || [];
    },

    toggleHorse(idx) {
      this.expandedHorses[idx] = !this.expandedHorses[idx];
    },

    nextMeeting() {
      if (this.meetingIndex < (this.data?.length || 1) - 1) this.meetingIndex++;
    },

    prevMeeting() {
      if (this.meetingIndex > 0) this.meetingIndex--;
    }
  }));

  /* ─── FESTIVAL ─────────────────────────────────────── */
  Alpine.data('festivalApp', () => ({
    data: null,
    loading: true,
    error: null,
    activeDay: 1,
    days: ['Day 1', 'Day 2', 'Day 3', 'Day 4'],

    init() {
      this.loadFestival();
    },

    async loadFestival() {
      this.loading = true;
      this.error = null;
      const json = await fetchJSON('', 'cheltenham.json');
      if (!json) {
        this.error = 'Festival data not yet available.';
        this.loading = false;
        return;
      }
      this.data = json;
      this.loading = false;
    },

    setDay(day) {
      this.activeDay = day;
    }
  }));
});
