<template>
  <div class="mx-calendar">
    <div class="mx-calendar-header">
      <a
        v-show="panel !== 'TIME'"
        class="mx-icon-last-year"
        @click="handleIconYear(-1)">&laquo;</a>
      <a
        v-show="panel === 'DATE'"
        class="mx-icon-last-month"
        @click="handleIconMonth(-1)">&lsaquo;</a>
      <a
        v-show="panel !== 'TIME'"
        class="mx-icon-next-year"
        @click="handleIconYear(1)">&raquo;</a>
      <a
        v-show="panel === 'DATE'"
        class="mx-icon-next-month"
        @click="handleIconMonth(1)">&rsaquo;</a>
      <a
        v-show="panel === 'DATE'"
        class="mx-current-month"
        @click="handleBtnMonth">{{months[calendarMonth-1]}}</a>
      <a
        v-show="panel === 'DATE' || panel === 'MONTH'"
        class="mx-current-year"
        @click="handleBtnYear">{{calendarYear}}</a>
      <a
        v-show="panel === 'YEAR'"
        class="mx-current-year">{{yearHeader}}</a>
      <a
        v-show="panel === 'TIME'"
        class="mx-time-header"
        @click="handleTimeHeader">{{timeHeader}}</a>
    </div>
    <div class="mx-calendar-content">
      <panel-date
        v-show="panel === 'DATE'"
        :value="value"
        :date-format="dateFormat"
        :calendar-month="calendarMonth"
        :calendar-year="calendarYear"
        :start-at="startAt"
        :end-at="endAt"
        :first-day-of-week="firstDayOfWeek"
        :disabled-date="isDisabledDate"
        @select="selectDate"/>
      <panel-year
        v-show="panel === 'YEAR'"
        :value="value"
        :disabled-year="isDisabledYear"
        :first-year="firstYear"
        @select="selectYear" />
      <panel-month
        v-show="panel === 'MONTH'"
        :value="value"
        :disabled-month="isDisabledMonth"
        :calendar-year="calendarYear"
        @select="selectMonth" />
      <panel-time
        v-show="panel === 'TIME'"
        :minute-step="minuteStep"
        :time-picker-options="timePickerOptions"
        :value="value"
        :disabled-time="isDisabledTime"
        :time-type="timeType"
        @select="selectTime"
        @pick="pickTime" />
    </div>
  </div>
</template>

<script>
import { isValidDate, isDateObejct, formatDate } from '@/utils/index'
import PersianDate from '@/utils/PersianDate'
import locale from '@/mixins/locale'
import scrollIntoView from '@/utils/scroll-into-view'
import PanelDate from '@/panel/date'
import PanelYear from '@/panel/year'
import PanelMonth from '@/panel/month'
import PanelTime from '@/panel/time'

export default {
  name: 'CalendarPanel',
  components: { PanelDate, PanelYear, PanelMonth, PanelTime },
  mixins: [locale],
  props: {
    value: {
      default: null,
      validator: function (val) {
        return val === null || isValidDate(val)
      }
    },
    startAt: null,
    endAt: null,
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'date' // ['date', 'datetime'] zendy added 'month', 'year', mxie added "time"
    },
    dateFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    // below user set
    firstDayOfWeek: {
      default: 7,
      type: Number,
      validator: val => val >= 1 && val <= 7
    },
    notBefore: {
      default: null,
      validator: function (val) {
        return !val || isValidDate(val)
      }
    },
    notAfter: {
      default: null,
      validator: function (val) {
        return !val || isValidDate(val)
      }
    },
    disabledDays: {
      type: [Array, Function],
      default: function () {
        return []
      }
    },
    minuteStep: {
      type: Number,
      default: 0,
      validator: val => val >= 0 && val <= 60
    },
    timePickerOptions: {
      type: [Object, Function],
      default () {
        return null
      }
    }
  },
  data () {
    const now = new PersianDate()
    const calendarYear = now.getFullYear()
    const calendarMonth = now.getMonth()
    const firstYear = Math.floor(calendarYear / 10) * 10
    return {
      panel: 'DATE',
      dates: [],
      calendarMonth,
      calendarYear,
      firstYear
    }
  },
  computed: {
    now: {
      get () {
        console.log('calendar.now.get', new PersianDate(this.calendarYear, this.calendarMonth, 1))
        return new PersianDate(this.calendarYear, this.calendarMonth, 1).getTime()
      },
      set (val) {
        console.log('calendar.now.set', val)
        const now = new PersianDate(val)
        this.calendarYear = now.getFullYear()
        this.calendarMonth = now.getMonth()
      }
    },
    timeType () {
      const h = /h+/.test(this.$parent.format) ? '12' : '24'
      const a = /A/.test(this.$parent.format) ? 'A' : 'a'
      return [h, a]
    },
    timeHeader () {
      if (this.type === 'time') {
        return this.$parent.format
      }
      return this.value && formatDate(this.value, this.dateFormat)
    },
    yearHeader () {
      return this.firstYear + ' ~ ' + (this.firstYear + 10)
    },
    months () {
      return this.t('months')
    },
    notBeforeTime () {
      return this.getCriticalTime(this.notBefore)
    },
    notAfterTime () {
      return this.getCriticalTime(this.notAfter)
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: 'updateNow'
    },
    visible: {
      immediate: true,
      handler: 'init'
    },
    panel: {
      immediate: true,
      handler: 'handelPanelChange'
    }
  },
  methods: {
    handelPanelChange (panel) {
      if (panel === 'YEAR') {
        this.firstYear = Math.floor(this.calendarYear / 10) * 10
      } else if (panel === 'TIME') {
        this.$nextTick(() => {
          const list = this.$el.querySelectorAll('.mx-panel-time .mx-time-list')
          for (let i = 0, len = list.length; i < len; i++) {
            const el = list[i]
            scrollIntoView(el, el.querySelector('.actived'))
          }
        })
      }
    },
    init () {
      const type = this.type
      if (type === 'month') {
        this.panel = 'MONTH'
      } else if (type === 'year') {
        this.panel = 'YEAR'
      } else if (type === 'time') {
        this.panel = 'TIME'
      } else {
        this.panel = 'DATE'
      }
      this.updateNow(this.value)
    },
    // 根据value更新日历
    updateNow (value) {
      this.now = value ? new PersianDate(value) : new PersianDate()
    },
    getCriticalTime (value) {
      if (!value) {
        return null
      }
      const date = new PersianDate(value)
      if (this.type === 'year') {
        return new PersianDate(date.getFullYear(), 0).getTime()
      } else if (this.type === 'month') {
        return new PersianDate(date.getFullYear(), date.getMonth()).getTime()
      } else if (this.type === 'date') {
        return date.setHours(0, 0, 0, 0)
      }
      return date.getTime()
    },
    inBefore (time, startAt) {
      startAt = startAt || this.startAt
      return (this.notBeforeTime && time < this.notBeforeTime) ||
        (startAt && time < this.getCriticalTime(startAt))
    },
    inAfter (time, endAt) {
      endAt = endAt || this.endAt
      return (this.notAfterTime && time > this.notAfterTime) ||
        (endAt && time > this.getCriticalTime(endAt))
    },
    inDisabledDays (time) {
      if (Array.isArray(this.disabledDays)) {
        return this.disabledDays.some(v => this.getCriticalTime(v) === time)
      } else if (typeof this.disabledDays === 'function') {
        return this.disabledDays(new PersianDate(time))
      }
      return false
    },
    isDisabledYear (year) {
      const time = new PersianDate(year, 0).getTime()
      const maxTime = new PersianDate(year + 1, 0).getTime() - 1
      return this.inBefore(maxTime) || this.inAfter(time) || (this.type === 'year' && this.inDisabledDays(time))
    },
    isDisabledMonth (month) {
      const time = new PersianDate(this.calendarYear, month).getTime()
      const maxTime = new PersianDate(this.calendarYear, month + 1).getTime() - 1
      return this.inBefore(maxTime) || this.inAfter(time) || (this.type === 'month' && this.inDisabledDays(time))
    },
    isDisabledDate (date) {
      const time = new PersianDate(date).getTime()
      const maxTime = new PersianDate(date).setHours(23, 59, 59, 999)
      return this.inBefore(maxTime) || this.inAfter(time) || this.inDisabledDays(time)
    },
    isDisabledTime (date, startAt, endAt) {
      const time = new PersianDate(date).getTime()
      return this.inBefore(time, startAt) || this.inAfter(time, endAt) || this.inDisabledDays(time)
    },
    selectDate (date) {
      if (this.type === 'datetime') {
        let time = new PersianDate(date)
        // when the initial date string contains time
        if (typeof this.value === 'string' && this.value.indexOf(' ') > 0) {
          var timeString = this.value.substring(this.value.indexOf(' ') + 1);
          var splitedTimeString = timeString.split(':');
          time.setHours(parseInt(splitedTimeString[0]), parseInt(splitedTimeString[1]), parseInt(splitedTimeString[2]))
        }
        if (this.isDisabledTime(time)) {
          time.setHours(0, 0, 0)
          if (this.notBefore && time.getTime() < new PersianDate(this.notBefore).getTime()) {
            time = new PersianDate(this.notBefore)
          }
          if (this.startAt && time.getTime() < new PersianDate(this.startAt).getTime()) {
            time = new PersianDate(this.startAt)
          }
        }
        this.$emit('select-time', time)
        this.panel = 'TIME'
        return
      }
      console.log('calendar.selectdate', date)
      this.$emit('select-date', date)
    },
    selectYear (year) {
      this.changeCalendarYear(year)
      if (this.type.toLowerCase() === 'year') {
        return this.selectDate(new PersianDate(this.now))
      }
      this.showPanelMonth()
    },
    selectMonth (month) {
      this.changeCalendarMonth(month)
      if (this.type.toLowerCase() === 'month') {
        console.log('calendar.selectMonth', new PersianDate(this.now))
        return this.selectDate(new PersianDate(this.now))
      }
      this.showPanelDate()
    },
    selectTime (time) {
      this.$emit('select-time', time, false)
    },
    pickTime (time) {
      this.$emit('select-time', time, true)
    },
    changeCalendarYear (year) {
      this.now = new PersianDate(year, this.calendarMonth, 1)
    },
    changeCalendarMonth (month) {
      console.log('calendar.changeCalendarMonth', new PersianDate(this.calendarYear, month, 1))
      this.now = new PersianDate(this.calendarYear, month, 1)
    },
    getSibling () {
      const calendars = this.$parent.$children.filter(v => v.$options.name === this.$options.name)
      const index = calendars.indexOf(this)
      const sibling = calendars[index ^ 1]
      return sibling
    },
    handleIconMonth (flag) {
      const month = this.calendarMonth
      this.changeCalendarMonth(month + flag)
      this.$parent.$emit('change-calendar-month', {
        month,
        flag,
        vm: this,
        sibling: this.getSibling()
      })
    },
    handleIconYear (flag) {
      if (this.panel === 'YEAR') {
        this.changePanelYears(flag)
      } else {
        const year = this.calendarYear
        this.changeCalendarYear(year + flag)
        this.$parent.$emit('change-calendar-year', {
          year,
          flag,
          vm: this,
          sibling: this.getSibling()
        })
      }
    },
    handleBtnYear () {
      this.showPanelYear()
    },
    handleBtnMonth () {
      this.showPanelMonth()
    },
    handleTimeHeader () {
      if (this.type === 'time') {
        return
      }
      this.showPanelDate()
    },
    changePanelYears (flag) {
      this.firstYear = this.firstYear + flag * 10
    },
    showPanelDate () {
      this.panel = 'DATE'
    },
    showPanelYear () {
      this.panel = 'YEAR'
    },
    showPanelMonth () {
      this.panel = 'MONTH'
    }
  }
}
</script>
