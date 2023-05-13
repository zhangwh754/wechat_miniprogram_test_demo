import { BASE_URL } from '../config/index.js'

const globalData = getApp().globalData

/**
 * @typedef {Object} requestReturns
 * @property {String} Message
 * @property {Number} Tag
 * @property {Object} Data
 */

/**
 * @param {String} title loading的标题
 * @param {String} url 请求url
 * @param {Object} data request body
 * @returns {Promise<requestReturns>}
 */
const request = function (title, url, data) {
  if (title != '') {
    wx.showLoading({
      title: title,
      mask: true,
    })
  }

  const token = wx.getStorageSync('token')

  token && (data.token = token)

  const header = { 'content-type': 'application/json;charset=utf-8' }

  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method: 'POST',
      data: data,
      header: header,
      timeout: 60000,
      success: res => {
        title && wx.hideLoading()
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          wx.showToast({
            title: '请求错误，请稍后重试！',
            icon: 'none',
          })
          reject('请求成功，返回失败')
        }
      },
      fail: () => {
        title && wx.hideLoading()
        wx.showToast({
          title: '服务器开小差了，再试一下吧~',
          icon: 'none',
        })
        reject('请求失败')
      },
    })
  })
}

export default request
