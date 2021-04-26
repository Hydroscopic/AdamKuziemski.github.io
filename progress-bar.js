class AnimatedText {
  /**
   * 
   * @param {string} elementId to animate
   * @param {Object} options {value, prefix, suffix, duration]
   */
  constructor(elementId, options) {
    /** @private {HTMLElement} */
    this.element = document.getElementById(elementId);
    /** @private {number} */
    this.value = options.value || 0;
    /** @private {string} */
    this.prefix = options.prefix || '';
    /** @private {string} */
    this.suffix = options.suffix || '';
    /** @private {number} */
    this.duration = options.duration || 500;
    /** @private {number} */
    this.animationTimer = -1;
  }

  /**
   * displays a new value if it differs from the current one
   * @param {number} newValue to display
   */
  setValue(newValue) {
    if (newValue !== this.value) {
      this.animate(newValue);
      this.value = newValue;
    }
  }

  /**
   * @private
   * animates text in the element
   * @param {number} newValue to animate towards
   */
  animate(newValue) {
    const range = newValue - this.value;
    const startTime = performance.now();
    const endTime = startTime + this.duration;

    const run = () => {
      const now = performance.now();
      const remaining = Math.max((endTime - now) / this.duration, 0);
      const displayedValue = (newValue - (remaining * range)).toFixed(2);

      this.element.innerText = this.prefix + displayedValue + this.suffix;

      if (displayedValue >= newValue) {
        clearInterval(this.animationTimer);
        this.animationTimer = -1;
      }
    }

    this.animationTimer = setInterval(run, Math.max(Math.abs(Math.floor(this.duration / range)), 20));
    run();
  }
}

class ProgressBar {
  constructor() {
    /** @readonly @private {Date} */
    this.birthday = new Date('07 Oct 1990 07:00');
    /** @private {HTMLDivElement} */
    this.bar = document.getElementById('progress-bar');
    /** @private {HTMLDivElement} */
    this.fill = document.getElementById('fill');
    /** @private {AnimatedText} */
    this.hint = new AnimatedText('percent-hint', {
      value: 0,
      suffix: '% towards next level',
      duration: 600
    });

    this.fill.style.width = '0%';
    this.setLevel();

    setInterval(() => this.setLevelAndExperience(), 1000);
  }

  /**
   * sets age/level and adjusts the experience bar
   */
  setLevelAndExperience() {
    const today = new Date().getTime();
    const age = this.calculateAge(today);

    this.setLevel(age);
    this.setProgressBarFill(this.calculateProgressTowardsNextLevel(age, today));
  }

  /**
   * @private
   * Calculates age based on a point in time
   * @param {number} pointInTime at which the age is calculated; defaults to new Date().getTime()
   * @returns {number} of years
   */
  calculateAge(pointInTime = new Date().getTime()) {
    return new Date(pointInTime - this.birthday.getTime()).getUTCFullYear() - 1970;
  }

  /**
   * @private
   * Sets age in the progress bar
   * @param {number} age to set; defaults to calculateAge()
   */
  setLevel(age = this.calculateAge()) {
    this.bar.title = `Level ${age} Engineer`;
  }

  /**
   * @private
   * Sets progress bar's fill width
   * @param {number} percent of the progress bar
   */
  setProgressBarFill(percent) {
    this.fill.style.width = percent + '%';
    this.hint.setValue(percent);
    this.bar.setAttribute('aria-valuenow', percent);
  }

  /**
   * @private
   * Calculates % towards next birthday, based on current age
   * @param {number} age to calculate next birthday
   * @param {number} pointInTime at which the progress is based
   * @returns percent of completion of the current level, capped between 0 and 100 inclusive
   * @returns {number} percent of completion of the current level, capped between 0 and 100 inclusive
   */
  calculateProgressTowardsNextLevel(age, pointInTime) {
    const year = new Date().getUTCFullYear();
    const daysInYear = this.isLeapYear(year) || this.isLeapYear(year - 1) ? 366 : 365;
    const percent = (100 - ((this.getNextBirthday(age) - pointInTime) / 864000) / daysInYear).toFixed(2);
    const nextBirthday = this.getNextBirthday(age);
    const lastBirthday = this.getNextBirthday(age, 0);
    const daysInYear = this.daysBetween(lastBirthday, nextBirthday);
    const percent = 100 - (((nextBirthday - pointInTime) / 864000) / daysInYear).toFixed(2);
    return Math.min(Math.max(percent, 0), 100);
  }

  /**
   * @private
   * Calculates next birthday's Unix time
   * @param {number} age 
   * @param {number} yearsForward how many years forward to set
   * @returns {number} Unix time of the next birthday
   */
  getNextBirthday(age) {
  getNextBirthday(age, yearsForward = 1) {
    return new Date(
      this.birthday.getUTCFullYear() + age + 1,
      this.birthday.getUTCFullYear() + age + yearsForward,
      this.birthday.getUTCMonth(), this.birthday.getUTCDate(),
      this.birthday.getUTCHours(), this.birthday.getUTCMinutes()
    ).getTime();
  }

  /**
   * @private
   * Chcecks if it's a leap year
   * @param {number} year
   * @returns {boolean} whether the current age's day count should count as a leap year
   * Calculates days between two dates
   * @param {Date} startDate 
   * @param {Date} endDate 
   * @returns {number} Days between two dates
   */
  isLeapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  daysBetween(startDate, endDate) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (this.convertToUTC(endDate) - this.convertToUTC(startDate)) / millisecondsPerDay;
  }

  /**
   * @private
   * Converts date to UTC
   * @param {Date} date 
   * @returns {Date} Converted to UTC
   */
  convertToUTC(date) {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }
}
