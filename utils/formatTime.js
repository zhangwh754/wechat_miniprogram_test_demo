/**
 * @typedef {'month' | 'day' | 'minute' | 'second'} Precision
 */

/**
 * @param {Date} date 时间
 * @param {Precision} precision 精度
 * @returns {String} 格式化后的时间
 */

const formatTime = (date, precision = 'day') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  let formatTimeStr = ''

  switch (precision) {
    case 'month':
      formatTimeStr = [year, month].map(formatNumber).join('/')
      break
    case 'day':
      formatTimeStr = [year, month, day].map(formatNumber).join('/')
      break
    case 'minute':
      formatTimeStr = [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
      break
    case 'second':
      formatTimeStr =
        [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
      break
    default:
      console.log('请输入month|day|minute|second作为精度')
      formatTimeStr = [year, month, day].map(formatNumber).join('/')
      break
  }

  return formatTimeStr
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export { formatTime }
