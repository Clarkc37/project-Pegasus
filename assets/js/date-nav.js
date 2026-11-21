// Date navigation component
// Handles Yesterday/Today/Tomorrow switching and date display

function dateNav() {
  return {
    showDate: 'Today',
    selectedDate: new Date().toISOString().split('T')[0],

    getDate(daysAhead) {
      const date = new Date();
      date.setDate(date.getDate() + daysAhead);
      return date.toISOString().split('T')[0];
    },

    goYesterday() {
      this.showDate = 'Yesterday';
      this.selectedDate = this.getDate(-1);
      this.$dispatch('date-changed', { date: this.selectedDate });
    },

    goToday() {
      this.showDate = 'Today';
      this.selectedDate = this.getDate(0);
      this.$dispatch('date-changed', { date: this.selectedDate });
    },

    goTomorrow() {
      this.showDate = 'Tomorrow';
      this.selectedDate = this.getDate(1);
      this.$dispatch('date-changed', { date: this.selectedDate });
    }
  };
}