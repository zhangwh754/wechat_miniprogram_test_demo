import { getSystemInfo } from '../../utils/index.js'

// components/sigin-input/sigin-input.js
Component({
  options: {
    pureDataPattern: /^canvas/, // 指定所有 _ 开头的数据字段为纯数据字段
  },
  properties: {
    title: {
      type: String,
    },
  },

  data: {
    // 画布控制器
    canvasContext: null,

    canvas: null,

    id: 'CANVAS_' + new Date().getTime(),

    width: 0,
    height: 0,

    canvasPosX: 0,
    canvasPosY: 0,
  },

  lifetimes: {
    attached() {
      // 高度计算
      const res = getSystemInfo()

      this.dpr = res.dpr

      this.setData({
        width: res.safeWidth - 50,
        height: res.safeHeight,
        navigationBarHeight: res.navigationBarHeight + res.statusBarHeight,
      })
    },
    ready() {
      this._initContext()
    },
  },

  methods: {
    // 初始化canvas画布
    _initContext() {
      const query = this.createSelectorQuery()
      query
        .select(`#${this.data.id}`)
        .fields({ node: true, size: true })
        .exec(res => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')

          canvas.width = res[0].width * this.dpr
          canvas.height = res[0].height * this.dpr

          ctx.strokeStyle = '#000000'
          ctx.lineWidth = 2
          ctx.font = '20px Arial'
          ctx.scale(this.dpr, this.dpr)

          this.setData({
            canvasContext: ctx,
            canvas: canvas,
          })
        })
    },

    // 离开page-container
    _leave() {
      this._clear()

      this.triggerEvent('close')
    },

    // 开始签名
    _start(e) {
      this.setData({
        canvasPosX: e.changedTouches[0].x,
        canvasPosY: e.changedTouches[0].y,
      })
      this.data.canvasContext.lineWidth = 5
      this.data.canvasContext.moveTo(this.data.canvasPosX, this.data.canvasPosY)
    },

    // 开始移动
    _move(e) {
      const { canvasContext, canvasPosX, canvasPosY } = this.data
      const { x: curX, y: curY } = e.changedTouches[0]

      const deltaX = Math.abs(canvasPosX - curX)
      const deltaY = Math.abs(canvasPosY - curY)

      // 相差大于3像素的时候作二阶贝塞尔曲线
      if (deltaX >= 3 || deltaY >= 3) {
        // 前后两点中心点
        const centerX = (canvasPosX + curX) / 2
        const centerY = (canvasPosY + curY) / 2

        //这里以前一点作为控制点，中心点作为终点，起始点为上一次的中点，很流畅啊！
        canvasContext.quadraticCurveTo(canvasPosX, canvasPosY, centerX, centerY)
        canvasContext.stroke()

        this.setData({
          canvasPosX: curX,
          canvasPosY: curY,
        })
      }

      this.setData({
        canvasPosX: e.changedTouches[0].x,
        canvasPosY: e.changedTouches[0].y,
      })
      canvasContext.lineTo(canvasPosX, canvasPosY)
      canvasContext.stroke()
    },

    _cancel() {
      this._clear()

      this.triggerEvent('close')
    },

    // 清空画布
    _clear() {
      const { canvasContext, width, height } = this.data
      canvasContext.clearRect(0, 0, width, height)

      canvasContext.strokeStyle = '#000000'
      canvasContext.lineWidth = 2
      canvasContext.font = '20px Arial'

      canvasContext.beginPath()
    },

    _confirm() {
      wx.canvasToTempFilePath({
        destWidth: this.data.width,
        destHeight: this.data.height,
        canvas: this.data.canvas,
        success: res => {
          this.triggerEvent('sign-img', res.tempFilePath)
        },
        fail(error) {
          console.log(error)
          wx.showToast({
            title: '图片生成失败',
            icon: 'none',
            duration: 1000,
          })
        },
      })
    },
  },
})
