import { getSystemInfo } from '../../utils/getSystemInfo.js'

let moveCount = 0

// components/sigin-input/sigin-input.js
Component({
  options: {
    pureDataPattern: /^canvas/, // 指定所有 _ 开头的数据字段为纯数据字段
  },
  properties: {
    title: {
      type: String,
    },
    watermarkText: {
      type: String,
    },
    isNeedRotate: {
      type: Boolean,
      value: true,
    },
  },

  data: {
    show: true,

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
      moveCount = 0

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

          if (this.properties.watermarkText) {
            this._drawWater(ctx, canvas)
          }
        })
    },

    _drawWater() {
      const ctx = this.data.canvasContext
      const canvas = this.data.canvas
      const watermarkText = this.properties.watermarkText

      ctx.font = '24px Arial'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)' // 设置水印文本颜色和透明度
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const textHeight = 24 // 假设水印文本高度为 24 像素

      const scale = 2 * this.dpr

      const startX = canvas.width / scale // 计算水印起始 X 坐标
      const startY = canvas.height / scale // 计算水印起始 Y 坐标

      ctx.save() // 保存当前绘图状态
      ctx.translate(canvas.width / scale, canvas.height / scale)
      ctx.rotate((82 * Math.PI) / 180)
      ctx.translate(-canvas.width / scale, -canvas.height / scale)

      for (let i = -3; i < 4; i++) {
        const x = startX
        const y = startY + i * textHeight * 2
        ctx.fillText(watermarkText, x, y)
      }
      ctx.restore() // 恢复之前的绘图状态
    },

    // 离开page-container
    _leave() {
      this._clear()

      this.setData(
        {
          show: false,
        },
        () => {
          this.triggerEvent('close')
        }
      )
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
      moveCount++
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
      } else {
        this.setData({
          canvasPosX: e.changedTouches[0].x,
          canvasPosY: e.changedTouches[0].y,
        })
        canvasContext.lineTo(canvasPosX, canvasPosY)
        canvasContext.stroke()
      }
    },

    _cancel() {
      this._clear()

      this.setData(
        {
          show: false,
        },
        () => {
          this.triggerEvent('close')
        }
      )
    },

    // 清空画布
    _clear() {
      moveCount = 0
      const { canvasContext, width, height } = this.data
      canvasContext.clearRect(0, 0, width, height)

      canvasContext.beginPath()

      if (this.properties.watermarktext) {
        this._drawWater() // 重新绘制水印
      }
    },

    _confirm() {
      if (moveCount < 80) {
        wx.showToast({
          title: '签名太小，请重新签名',
          icon: 'none',
        })
        this._clear()

        return
      }

      this.canvasToTempFilePath()
    },

    // 转换签名版canvas为临时图片
    canvasToTempFilePath() {
      wx.canvasToTempFilePath({
        destWidth: this.data.width,
        destHeight: this.data.height,
        canvas: this.data.canvas,
        success: res => {
          // 需要旋转，就先是用临时canvas旋转图片
          if (this.properties.isNeedRotate) {
            this.tempFilePathToCanvas(res.tempFilePath, this.data.width, this.data.height)
          }
          // 不需要旋转，直接发送签名图片地址
          else {
            this.triggerSubmit(res.tempFilePath)
          }
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

    // 转换临时图片为新的canvas
    tempFilePathToCanvas(tempFilePath) {
      const query = this.createSelectorQuery()
      query
        .select(`#myCanvas2`)
        .fields({ node: true, size: true })
        .exec(res => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const img = canvas.createImage()
          img.src = tempFilePath

          img.onload = () => {
            const { width, height } = img

            // 旋转画布
            canvas.width = height
            canvas.height = width
            ctx.rotate((-90 * Math.PI) / 180) // 负数表示逆时针方向旋转

            // 调整绘制位置和尺寸
            ctx.translate(-width, 0) // 水平偏移量为 -width
            ctx.drawImage(img, 0, 0, width, height)

            // 将旋转后的画布转为临时文件
            wx.canvasToTempFilePath({
              destWidth: height,
              destHeight: width,
              canvas: canvas,
              success: res => {
                this.triggerSubmit(res.tempFilePath)
              },
              fail: error => {
                console.log(error)
              },
            })
          }
        })
    },

    triggerSubmit(imgUrl) {
      this.setData(
        {
          show: false,
        },
        () => {
          this.data.canvasContext.clearRect(0, 0, this.data.width, this.data.height)
          this.triggerEvent('sign-img', imgUrl)
        }
      )
    },
  },
})
