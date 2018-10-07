import PersianDate from '@/utils/PersianDate'
import fecha from 'fecha'

export function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isDateObejct (value) {
  return value instanceof Date
}

export function isPersianDateObejct (value) {
  return value instanceof PersianDate
}

export function isValidDate (date) {
  if (date === null || date === undefined) {
    return false
  }
  return !isNaN(new PersianDate(date).getTime())
}

export function isValidRange (date) {
  return (
    Array.isArray(date) &&
    date.length === 2 &&
    isValidDate(date[0]) &&
    isValidDate(date[1]) &&
    (new PersianDate(date[1]).getTime() >= new PersianDate(date[0]).getTime())
  )
}

export function getTwoDigitsString(number) {
  return (number < 10 && number >= 0 ? '0' : '') + String(number);
}

export function parseTime (time) {
  const values = (time || '').split(':')
  if (values.length >= 2) {
    const hours = parseInt(values[0], 10)
    const minutes = parseInt(values[1], 10)
    return {
      hours,
      minutes
    }
  }
  return null
}

export function formatTime (time, type = '24', a = 'a') {
  let hours = time.hours
  hours = (type === '24') ? hours : (hours % 12 || 12)
  hours = hours < 10 ? '0' + hours : hours
  let minutes = time.minutes < 10 ? '0' + time.minutes : time.minutes
  let result = hours + ':' + minutes
  if (type === '12') {
    let suffix = time.hours >= 12 ? 'pm' : 'am'
    if (a === 'A') {
      suffix = suffix.toUpperCase()
    }
    result = `${result} ${suffix}`
  }
  return result
}

export function formatDate (date, format) {
  try {
    var result = String(format)
      .replace('ShortDate', date.getShortDate())
      .replace('FullDate', date.getFullDate())
      .replace('YYYY', date.getFullYear())
      .replace('MM', getTwoDigitsString(date.getMonth()))
      .replace('DD', getTwoDigitsString(date.getDate()))
      .replace('M', date.getMonth())
      .replace('D', date.getDate())
      .replace('HH', getTwoDigitsString(date.getHours()))
      .replace('hh', getTwoDigitsString(date.getHours() - (date.getHours() <= 12 ? 0 : 12)))
      .replace('mm', getTwoDigitsString(date.getMinutes()))
      .replace('ss', getTwoDigitsString(date.getSeconds()))
      .replace('a', getTwoDigitsString((date.getHours() <= 12 ? 'قبل' : 'بعد') + ' از ظهر'));

    return result
  } catch (e) {
    return ''
  }
}

export function parseDate (value) {
  try {
    return new PersianDate(value)
  } catch (e) {
    return false
  }
}
