import locale from '@/mixins/locale'
import { formatDate } from '@/utils/index'
import PersianDate from '@/utils/PersianDate'

export default {
  name: 'panelDate',
  mixins: [locale],
  props: {
    value: null,
    startAt: null,
    endAt: null,
    dateFormat: {
      type: String,
      default: 'YYYY/MM/DD'
    },
    calendarMonth: {
      default: new PersianDate().getMonth()
    },
    calendarYear: {
      default: new PersianDate().getFullYear()
    },
    firstDayOfWeek: {
      default: 1,
      type: Number,
      validator: val => val >= 1 && val <= 7
    },
    disabledDate: {
      type: Function,
      default: () => {
        return false
      }
    }
  },
  methods: {
    selectDate ({ year, month, day }) {
      const date = new PersianDate(year, month, day)
      if (this.disabledDate(date)) {
        return
      }
      this.$emit('select', date)
    },
    getDays (firstDayOfWeek) {
      const days = this.t('days')
      const firstday = parseInt(firstDayOfWeek, 10)
      return days.concat(days).slice(firstday, firstday + 7)
    },
    getDates (year, month, firstDayOfWeek) {
      const arr = []
      const time = new PersianDate(year, month, 0)

      const lastMonthLength = (time.getDay() + 7 - firstDayOfWeek) % 7 + 1
      const lastMonthfirst = time.getDate() - (lastMonthLength - 1)
      for (let i = 0; i < lastMonthLength; i++) {
        arr.push({ year, month: month - 1, day: lastMonthfirst + i })
      }

      time.setMonth(time.getMonth() + 2, 0);
      const curMonthLength = time.getDate();
      for (let i = 0; i < curMonthLength; i++) {
        arr.push({ year, month, day: 1 + i })
      }

      time.setMonth(time.getMonth() + 1, 1);
      const nextMonthLength = 42 - (lastMonthLength + curMonthLength)
      for (let i = 0; i < nextMonthLength; i++) {
        arr.push({ year, month: month + 1, day: 1 + i })
      }
      
      return arr
    },
    getCellClasses ({ year, month, day }) {
      const classes = []
      const cellTime = new PersianDate(year, month, day, 0, 0, 0).getTime()
      const today = new PersianDate().setHours(0, 0, 0).getTime()
      const curTime = this.value && new PersianDate(this.value).setHours(0, 0, 0).getTime()
      const startTime = this.startAt && new PersianDate(this.startAt).setHours(0, 0, 0).getTime()
      const endTime = this.endAt && new PersianDate(this.endAt).setHours(0, 0, 0).getTime()

      if (month < this.calendarMonth) {
        classes.push('last-month')
      } else if (month > this.calendarMonth) {
        classes.push('next-month')
      } else {
        classes.push('cur-month')
      }

      if (cellTime === today) {
        classes.push('today')
      }

      if (this.disabledDate(cellTime)) {
        classes.push('disabled')
      }

      if (curTime) {
        if (cellTime === curTime) {
          classes.push('actived')
        } else if (startTime && cellTime <= curTime) {
          classes.push('inrange')
        } else if (endTime && cellTime >= curTime) {
          classes.push('inrange')
        }
      }
      return classes
    },
    getCellTitle ({ year, month, day }) {
      return formatDate(new PersianDate(year, month, day), this.dateFormat)
    }
  },
  render (h) {
    const ths = this.getDays(this.firstDayOfWeek).map(day => {
      return <th>{day}</th>
    })

    const dates = this.getDates(this.calendarYear, this.calendarMonth, this.firstDayOfWeek)
    const tbody = Array.apply(null, { length: 6 }).map((week, i) => {
      const tds = dates.slice(7 * i, 7 * i + 7).map(date => {
        const attrs = {
          class: this.getCellClasses(date)
        }
        return (
          <td
            class="cell"
            {...attrs}
            title={this.getCellTitle(date)}
            onClick={this.selectDate.bind(this, date)}>
            {date.day}
          </td>
        )
      })
      return <tr>{tds}</tr>
    })

    return (
      <table class="mx-panel mx-panel-date">
        <thead>
          <tr>{ths}</tr>
        </thead>
        <tbody>
          {tbody}
        </tbody>
      </table>
    )
  }
}
