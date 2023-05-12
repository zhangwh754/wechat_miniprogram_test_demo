// pages/signature/signature.js

Component({
  data: {},

  methods: {
    onReady() {
      const query = wx.createSelectorQuery()
      query
        .select('#myCanvas')
        .fields({ node: true, size: true })
        .exec(res => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')

          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)

          ctx.fillRect(0, 0, 100, 100)
        })
    },

    bindtouchstart(e) {
      this.context.moveTo(e.changedTouches[0].x, e.changedTouches[0].y)
    },
    // 触摸移动
    bindtouchmove(e) {
      this.context.lineTo(e.changedTouches[0].x, e.changedTouches[0].y)
      this.context.stroke()
      this.context.draw(true)
      this.context.moveTo(e.changedTouches[0].x, e.changedTouches[0].y)
    },

    exit() {},

    clear() {},

    export() {},
  },
})
