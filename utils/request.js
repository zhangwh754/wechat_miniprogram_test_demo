import { BASE_URL } from '../config/index.js'
import wxp from './promisefy'

/**
 * 对wx.navigateTo的封装
 * @param {String} url 地址
 */
const request = url => {
  return wxp
    .request({
      method: 'GET',
      url: `${BASE_URL}${url}`,
    })
    .then(res => res.data)
    .catch(res => res.data)
}

export default request
