// Racecard data loader — Alpine.js compatible
// Fetches and filters racecard JSON data from the R2 proxy

function racecardLoader() {
  return {
    raceData: [],
    selectedDate: new Date().toISOString().split('T')[0],
    loading: true,
    error: null,

    getDate(daysAhead) {
      const date = new Date();
      date.setDate(date.getDate() + daysAhead);
      return date.toISOString().split('T')[0];
    },

    async fetchData() {
      this.loading = true;
      this.error = null;
      const url = `/data/racecards/${this.selectedDate}.json?t=${Date.now()}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Racecard data not found');
        this.raceData = await response.json();
      } catch (error) {
        console.error('Error loading race data:', error);
        this.raceData = [];
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  };
}

function festivalLoader() {
  return {
    date: '',
    timeDisplay: '',
    festivalData: [],
    courseData: null,
    racecardData: null,
    loading: true,
    isOpen: false,

    init() {
      const params = new URLSearchParams(window.location.search);
      this.date = params.get('date');
      this.timeDisplay = params.get('time');

      fetch('/data/racecards/cheltenham.json')
        .then(res => res.json())
        .then(data => {
          this.festivalData = data;
          const targetDay = data.find(d => d.date === this.date);
          if (targetDay) {
            this.courseData = targetDay;
            this.racecardData = targetDay.races.find(r => r.timeDisplay === this.timeDisplay);
          }
          this.loading = false;
        })
        .catch(err => {
          console.error('Festival Load Error:', err);
          this.loading = false;
        });
    }
  };
}

function singleRaceLoader() {
  return {
    isOpen: false,
    date: null,
    courseName: null,
    timeDisplay: null,
    raceData: [],
    courseData: null,
    racecardData: null,

    init() {
      const urlParams = new URLSearchParams(window.location.search);
      this.date = urlParams.get('date');
      this.courseName = urlParams.get('course');
      this.timeDisplay = urlParams.get('time');

      if (this.date) {
        fetch(`/data/racecards/${this.date}.json?t=${Date.now()}`)
          .then(response => response.json())
          .then(data => {
            this.raceData = data;
            this.filterRacecards();
          })
          .catch(error => console.error('Error fetching racecards:', error));
      }
    },

    filterRacecards() {
      if (this.courseName) {
        this.courseData = this.raceData.find(course =>
          course.Course && course.Course.toLowerCase() === this.courseName.toLowerCase()
        ) || null;

        if (this.courseData && this.timeDisplay) {
          this.racecardData = this.courseData.races.find(race =>
            race.timeDisplay && race.timeDisplay === this.timeDisplay
          ) || null;
        } else {
          this.racecardData = null;
        }
      } else {
        this.courseData = null;
        this.racecardData = null;
      }
    }
  };
}