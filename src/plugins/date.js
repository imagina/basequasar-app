import moment from 'moment';

class DatePlugin {

  /**
   * Return timestamp in second unix
   * @param date
   * @returns {number}
   */
  timestamp(date) {
    date = date ? date : new Date();
    return date / 1000 | 0;
  }

  /**
   * Return range date
   * @param type {string} requiere : ('today','currentMonth','lastMonth')
   */
  getRange(type) {
    type ? true : type = 'today';

    let from = new Date(); //Create object date
    let to = new Date(); //Create object date
    switch (type) {
      case 'today':
        break;
      case 'yesterday':
        from.setSeconds(-86400);
        to.setSeconds(-86400);
        break;
      case 'tomorrow':
        from.setSeconds(86400);
        to.setSeconds(86400);
        break;
      case 'currentMonth':
        from.setDate(1);
        to = new Date(to.getFullYear(), from.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        from = new Date(from.getFullYear(), from.getMonth() - 1, 1);
        to = new Date(to.getFullYear(), to.getMonth(), 0);
        break;

    }

    return {
      from: from.getFullYear() + '/' + (from.getMonth() + 1) + '/' + from.getDate(),
      to: to.getFullYear() + '/' + (to.getMonth() + 1) + '/' + to.getDate()
    };
  }

  /**
   * Return names from mounts current last and nex
   *
   * @returns {*[]}
   */
  nameMonths() {
    var d = new Date();
    var months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return [
      { label: months[d.getMonth() - 1], value: 'lastMonth' },
      { label: months[d.getMonth()], value: 'currentMonth' },
      { label: 'Today', value: 'today' }
    ];
  }

  /**
   * Get diference bettewn two dates
   *
   * @params futureDate,currentDate
   * @returns {{hours: number, seconds: number, minutes: number, day: number}}
   */
  getDiff(futureDate, currentDate) {
    let date1 = this.timestamp(new Date(futureDate));
    let date2 = this.timestamp(new Date(currentDate));
    let date = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (date1 < date2) {
      //Dates to timestamp
      let dt1 = +new Date(futureDate);
      let dt2 = +new Date(currentDate);

      // get total seconds between the times
      var delta = Math.abs(dt1 - dt2) / 1000;

      // calculate (and subtract) whole days
      date.days = Math.floor(delta / 86400);
      delta -= date.days * 86400;

      // calculate (and subtract) whole hours
      date.hours = Math.floor(delta / 3600) % 24;
      delta -= date.hours * 3600;

      // calculate (and subtract) whole minutes
      date.minutes = Math.floor(delta / 60) % 60;
      delta -= date.minutes * 60;

      // what's left is seconds
      date.seconds = Math.floor(delta % 60);  // in theory the modulus is not required
    }

    return date;
  }

  /**
   * Add hours to date
   *
   * @param date
   * @param hours
   * @returns {*}
   */
  addHours(date, hours) {
    Date.prototype.addHours = function(h) {
      this.setTime(this.getTime() + (h * 60 * 60 * 1000));
      return this;
    };

    return new Date(date).addHours(hours);
  }

  /**
   * Return human diff date from current date
   * @param date
   */
  getHumanCalendar(date, optionsCalendar = {}) {
    return moment(date).calendar(null, {
      sameDay: 'hh:mm a',
      nextDay: '[Tomorrow]',
      lastDay: '[Yesterday]',
      lastWeek: 'dddd',
      sameElse: 'MM/DD/YYYY',
      ...optionsCalendar
    });
  }

  calculateNewDate(date, { isAdd = false, amount = 1, unit = 'day', format, isStart = true }) {
    let newDate = moment(date);

    newDate = isAdd ? newDate.add(amount, unit) : newDate.subtract(amount, unit);

    newDate = isStart ? newDate.startOf(unit) : newDate.endOf(unit)

    return newDate.format(format);
  }
}

const date = new DatePlugin();

export default date;

export { date };
