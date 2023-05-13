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

    posX: 0,
    posY: 0,
  },

  lifetimes: {
    attached() {
      // 高度计算
      wx.getSystemInfo({
        success: res => {
          const ios = !!(res.system.toLowerCase().search('ios') + 1)

          const screenWidth = res.screenWidth
          const screenHeight = res.screenHeight

          const navigationBarHeight = ios ? 44 : 48

          this.dpr = res.pixelRatio

          this.setData({
            navigationBarHeight: res.statusBarHeight + navigationBarHeight,
            width: screenWidth - 50,
            height: screenHeight - navigationBarHeight - res.statusBarHeight,
          })
        },
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
        posX: e.changedTouches[0].x,
        posY: e.changedTouches[0].y,
      })
      this.data.canvasContext.lineWidth = 5
      this.data.canvasContext.moveTo(this.data.posX, this.data.posY)
    },

    // 开始移动
    _move(e) {
      const { canvasContext, posX, posY } = this.data

      this.setData({
        posX: e.changedTouches[0].x,
        posY: e.changedTouches[0].y,
      })
      canvasContext.lineTo(posX, posY)
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
      canvasContext.beginPath()
    },

    _confirm() {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: this.data.width,
        height: this.data.height,
        destWidth: this.data.width,
        destHeight: this.data.height,
        canvas: this.data.canvas,
        success: res => {
          this.triggerEvent('sign-img', res.tempFilePath)
        },
        fail() {
          console.log(error)
          wx.showToast({
            title: '图片生成失败',
          })
        },
      })
    },
  },
})
