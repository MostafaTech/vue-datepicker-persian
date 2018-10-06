import locale from '@/mixins/locale'
import PersianDate from '@/utils/PersianDate'

export default {
  name: 'panelMonth',
  mixins: [locale],
  props: {
    value: null,
    calendarYear: {
      default: new PersianDate().getFullYear()
    },
    disabledMonth: Function
  },
  methods: {
    isDisabled (month) {
      if (typeof this.disabledMonth === 'function' && this.disabledMonth(month)) {
        return true
      }
      return false
    },
    selectMonth (month) {
      if (this.isDisabled(month)) {
        return
      }
      console.log('month.selectMonth', month)      
      this.$emit('select', month)
    }
  },
  render (h) {
    let months = this.t('months')
    const currentYear = this.value && new PersianDate(this.value).getFullYear()
    const currentMonth = this.value && new PersianDate(this.value).getMonth()
    months = months.map((v, i) => {
      return <span
        class={{
          'cell': true,
          'actived': currentYear === this.calendarYear && currentMonth === i+1,
          'disabled': this.isDisabled(i+1)
        }}
        onClick={this.selectMonth.bind(this, i+1)}>
        {v}
      </span>
    })
    return <div class="mx-panel mx-panel-month">{months}</div>
  }
}
