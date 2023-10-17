import { initChart } from './utils'

let chart = null

Page({
  data: {
    ec: {
      onInit: initChart(chart),
    },
  },

  onReady() {
    setTimeout(function () {
      // 获取 chart 实例的方式
      // console.log(chart)
    }, 2000)
  },
})
