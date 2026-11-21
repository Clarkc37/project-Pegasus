// Racecard Alpine.js Components
// 4 components: racecardApp, racecardListApp, racecardDetailApp, festivalApp

document.addEventListener('alpine:init', () => {

  /* ============================================================
   * 1) racecardApp — Homepage: full racecard overview
   *    Used by: layouts/_default/home.html
   * ============================================================ */
  Alpine.data('racecardApp', () => ({
    raceData: [],
    festivalData: [],
    festivalTitle: '',
    festivalDays: [],
    selectedDate: getDateString(0),
    loading: true,
    error: null,

    async init() {
      // Try festival data (banner hidden if not available)
      try {
        const fest = await fetchJSON('/data/racecards/cheltenham.json');
        if (fest) {
          this.festivalData = fest;
          this.festivalTitle = fest.title || 'Cheltenham Festival 2026';
          this.festivalDays = fest.days || (Array.isArray(fest) ? fest : []);
        }
      } catch (_e) {
        // Festival data not available — banner stays hidden (x-show="festivalData.length > 0")
      }

      // Load today's racecards
      await this.fetchData();

      // Listen for date changes from dateNav
      window.addEventListener('date-changed', (evt) => {
        this.selectedDate = evt.detail.date;
        this.fetchData();
      });
    },

    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchJSON(`/data/racecards/${this.selectedDate}.json`);
        this.raceData = Array.isArray(data) ? data : (data.racecards || data.courses || []);
      } catch (err) {
        this.raceData = [];
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    get totalRaceCount() {
      if (!this.raceData.length) return 0;
      return this.raceData.reduce(function (sum, course) {
        return sum + (course.Races || course.races || []).length;
      }, 0);
    }
  }));

  /* ============================================================
   * 2) racecardListApp — Racecard listing / browse
   *    Used by: layouts/racecards/list.html
   * ============================================================ */
  Alpine.data('racecardListApp', () => ({
    raceData: [],
    selectedDate: getDateString(0),
    loading: true,
    error: null,

    getDate(daysAhead) {
      return getDateString(daysAhead);
    },

    async init() {
      await this.fetchData();
    },

    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchJSON(`/data/racecards/${this.selectedDate}.json`);
        this.raceData = Array.isArray(data) ? data : (data.racecards || data.courses || []);
        this.raceData.forEach(function (c) {
          if (c.expanded === undefined) c.expanded = false;
        });
      } catch (err) {
        this.raceData = [];
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    toggleCourse(course) {
      course.expanded = !course.expanded;
    }
  }));

  /* ============================================================
   * 3) racecardDetailApp — Single racecard detail view
   *    Used by: layouts/racecards/single.html
   * ============================================================ */
  Alpine.data('racecardDetailApp', () => ({
    raceData: [],
    date: null,
    courseName: null,
    timeDisplay: null,
    courseData: null,
    racecardData: null,
    loading: true,
    error: null,

    get courseGoing() {
      return this.courseData?.Going || this.courseData?.going || '';
    },

    get horses() {
      if (!this.racecardData) return [];
      var runners = this.racecardData.runners || this.racecardData.horses || this.racecardData.entries || [];

      // Find lowest prediction score for top pick badge
      var minScore = Infinity;
      var maxBetScore = -Infinity;
      runners.forEach(function (h) {
        var score = h.prediction?.score ?? h.predictionScore ?? h.prediction_score ?? Infinity;
        var betScore = h.bet?.prediction?.score ?? h.bet_score ?? -Infinity;
        if (score < minScore) minScore = score;
        if (betScore > maxBetScore) maxBetScore = betScore;
      });

      return runners.map(function (h, idx) {
        var score = h.prediction?.score ?? h.predictionScore ?? h.prediction_score ?? Infinity;
        var betScore = h.bet?.prediction?.score ?? h.bet_score ?? -Infinity;
        return Object.assign({}, h, {
          expanded: false,
          isTopPick: score === minScore && minScore < Infinity,
          isBestValue: betScore === maxBetScore && maxBetScore > -Infinity,
          predictionRank: idx + 1
        });
      });
    },

    async init() {
      var urlParams = new URLSearchParams(window.location.search);
      this.date = urlParams.get('date') || getDateString(0);
      this.courseName = urlParams.get('course') || '';
      this.timeDisplay = urlParams.get('time') || '';

      try {
        var data = await fetchJSON('/data/racecards/' + this.date + '.json');
        this.raceData = Array.isArray(data) ? data : (data.racecards || data.courses || []);

        // Find matching course
        var courseLower = this.courseName.toLowerCase();
        this.courseData = null;
        for (var i = 0; i < this.raceData.length; i++) {
          var c = this.raceData[i];
          if ((c.Course || c.course || '').toLowerCase() === courseLower) {
            this.courseData = c;
            break;
          }
        }

        // Find matching race
        if (this.courseData) {
          var races = this.courseData.Races || this.courseData.races || [];
          this.racecardData = null;
          for (var j = 0; j < races.length; j++) {
            if ((races[j].timeDisplay || races[j].time || '') === this.timeDisplay) {
              this.racecardData = races[j];
              break;
            }
          }
          if (!this.racecardData && races.length > 0) {
            this.racecardData = races[0];
          }
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    toggleExpand(horse) {
      horse.expanded = !horse.expanded;
    }
  }));

  /* ============================================================
   * 4) festivalApp — Festival page with day tabs
   *    Used by: layouts/racecards/festival.html
   * ============================================================ */
  Alpine.data('festivalApp', () => ({
    festivalTitle: '',
    going: '',
    forecast: '',
    festivalCourse: 'Cheltenham',
    days: [],
    activeDay: 0,
    loading: true,
    error: null,

    get totalRaces() {
      return this.days.reduce(function (sum, d) { return sum + (d.races || []).length; }, 0);
    },

    get topTrainer() {
      return '—';
    },

    async init() {
      try {
        var data = await fetchJSON('/data/racecards/cheltenham.json');
        if (data) {
          this.festivalTitle = data.title || data.festivalTitle || 'Cheltenham Festival 2026';
          this.going = data.going || data.Going || '—';
          this.forecast = data.forecast || data.Forecast || '—';
          this.festivalCourse = data.course || data.Course || 'Cheltenham';
          this.days = data.days || (Array.isArray(data) ? data : []);
          this.activeDay = 0;
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }));

});