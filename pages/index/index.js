import { emitter } from '../../utils/index.js'

Page({
  onShow() {
    this.age = 18 + Math.floor(Math.random() * 100 + 1)

    emitter.emit('foo', { name: 'zwh', age: this.age })
  },

  onUnload() {},

  toForm() {
    wx.redirectTo({
      url: '../form/form',
    })
  },
})
