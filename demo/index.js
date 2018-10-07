import Vue from 'vue'
import DatePicker from '@/index'

Vue.use(DatePicker)

new Vue({  // eslint-disable-line
  el: '#app',
  data () {
    return {
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      value7: '',
      value8: '',
      value9: '',
      value10: '',
      value11: '1397',
      value12: ''
    }
  },
  methods: {
    getSource (obj) {
      return Object.keys(obj).map(key => {
        const value = obj[key]
        return (
          <section class="source">
            <label class="label">{key} : </label>
            {Vue.compile(value).render.call(this)}
          </section>
        )
      })
    },
    getPre (obj) {
      return Object.keys(obj).map(key => {
        const value = obj[key].replace(/\n/g, '').replace(/\s+/g, ' ')
        return (
          <pre class="pre">
            <code class="language-html">{value}</code>
          </pre>
        )
      })
    }
  },
  render (h) {
    const example1 = {
      'پایه': '<date-picker v-model="value1"></date-picker>',
      'بازه': '<date-picker v-model="value2" range ></date-picker>',
      'ماه': '<date-picker v-model="value10" type="month" format="YYYY/MM"></date-picker>',
      'سال': '<date-picker v-model="value11" type="year" format="YYYY"></date-picker>',
      'زمان': '<date-picker v-model="value12" type="time" format="HH:mm:ss" placeholder="انتخاب زمان"></date-picker>'
    }
    const example2 = {
      'تاریخ': `
        <date-picker
          v-model="value3"
          type="datetime"
          format="YYYY/MM/DD HH:mm"></date-picker>`,
      'تاریخ بهمراه time-picker-options': `
        <date-picker
          v-model="value4"
          type="datetime"
          format="YYYY/MM/DD HH:mm:ss"
          :time-picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30'
          }"></date-picker>`,
      'تاریخ بهمراه minute-step': `
        <date-picker
          v-model="value9"
          type="datetime"
          format="YYYY/MM/DD HH:mm:ss"
          :minute-step="10"
          ></date-picker>`,
      'بازه تاریخی': `
        <date-picker
          v-model="value5"
          range
          type="datetime"
          format="YYYY/MM/DD HH:mm:ss"></date-picker>`
    }
    const example3 = {
      'بهمراه تایید': `
        <date-picker
          v-model="value6"
          format="YYYY/MM/DD"
          confirm></date-picker>`,
      'انتخاب تاریخ بهمراه تایید': `
        <date-picker
          v-model="value7"
          type="datetime"
          format="YYYY/MM/DD hh:mm:ss"
          confirm></date-picker>`,
      'انتخاب بازه تاریخی بهمراه تایید': `
        <date-picker
          v-model="value8"
          range
          format="YYYY/MM/DD"
          confirm></date-picker>`
    }
    const arr = [
      {
        exam: example1
      },
      {
        exam: example2,
        tips: 'if you use the datetime, you should set the format to "YYYY/MM/DD HH:mm:ss" which default is "YYYY/MM/DD'
      },
      {
        exam: example3,
        tips: 'Recommend to use the confirm option when the type is "datetime" or "range" is true'
      }
    ]
    return (
      <div id="app">
        {arr.map(obj => (
          <div class="example">
            {this.getSource(obj.exam)}
            {
              obj.tips
                ? <blockquote class="tips">{obj.tips}</blockquote>
                : ''
            }
            {this.getPre(obj.exam)}
          </div>
        ))}
      </div>
    )
  }
})
