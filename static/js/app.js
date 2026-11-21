// Global Guide Racing — app.js
// Shared utilities and date helpers

/**
 * Format a date as YYYY-MM-DD.
 */
window.formatDate = function (date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

/**
 * Get a date string offset by days from today.
 */
window.getDateString = function (daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return formatDate(date);
};

/**
 * Fetch JSON from a URL with cache-busting.
 */
window.fetchJSON = async function (url) {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
  }
  return resp.json();
};

/**
 * Format odds for display (handle decimal/fractional/string).
 */
window.formatOdds = function (odds) {
  if (!odds && odds !== 0) return 'N/A';
  if (typeof odds === 'string') return odds;
  if (typeof odds === 'number') {
    if (odds >= 1) {
      const frac = odds - 1;
      if (frac < 0.1) return '1/10';
      if (frac < 0.5) return '1/2';
      if (frac < 1) return 'EVS';
      if (frac < 2) return '2/1';
      if (frac < 3) return '3/1';
      if (frac < 4) return '4/1';
      if (frac < 5) return '5/1';
      if (frac < 6) return '6/1';
      if (frac < 7) return '7/1';
      if (frac < 8) return '8/1';
      if (frac < 9) return '9/1';
      if (frac < 10) return '10/1';
      return `${Math.round(frac)}/1`;
    }
  }
  return String(odds);
};

/**
 * Format a time value for display.
 */
window.formatTime = function (time) {
  if (!time) return '';
  if (/^\d{2}:\d{2}/.test(time)) return time;
  return time;
};

// Date navigation Alpine component
document.addEventListener('alpine:init', () => {
  Alpine.data('dateNav', () => ({
    showDate: 'Today',
    selectedDate: getDateString(0),

    getDate(daysAhead) {
      return getDateString(daysAhead);
    },

    goYesterday() {
      this.showDate = 'Yesterday';
      this.selectedDate = this.getDate(-1);
      window.dispatchEvent(new CustomEvent('date-changed', {
        detail: { date: this.selectedDate }
      }));
    },

    goToday() {
      this.showDate = 'Today';
      this.selectedDate = this.getDate(0);
      window.dispatchEvent(new CustomEvent('date-changed', {
        detail: { date: this.selectedDate }
      }));
    },

    goTomorrow() {
      this.showDate = 'Tomorrow';
      this.selectedDate = this.getDate(1);
      window.dispatchEvent(new CustomEvent('date-changed', {
        detail: { date: this.selectedDate }
      }));
    }
  }));
});