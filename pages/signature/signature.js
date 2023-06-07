import { getSystemInfo } from '../../utils/index.js'

// pages/signature/signature.js
Component({
  data: {
    isSignInputShow: false,
  },

  methods: {
    onLoad() {},

    handleTap() {
      this.toggleSignInputShow()
    },

    toggleSignInputShow() {
      this.setData({
        isSignInputShow: !this.data.isSignInputShow,
      })
    },

    async handleSignImg(e) {
      this.toggleSignInputShow()

      try {
        // await this.uploadFile(e.detail)
        wx.showToast({
          title: '上传图片成功',
          icon: 'none',
        })
      } catch (error) {
        wx.showToast({
          title: error,
          icon: 'none',
        })
      }
    },

    uploadFile(temImgUrl) {
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: 'http://192.168.10.104:3000/upload',
          filePath: temImgUrl,
          name: 'file',
          success(res) {
            const data = JSON.parse(res.data)

            if (data.code !== 200) {
              reject(data.msg)
            } else {
              resolve(data.msg)
            }
          },
          fail() {
            wx.showToast({
              title: '上传失败',
              icon: 'none',
              duration: 2000,
            })
          },
        })
      })
    },
  },
})
