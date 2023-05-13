// pages/signature/signature.js
Component({
  data: {
    isSignInputShow: false,

    resultArr: [],
  },

  methods: {
    handleTap() {
      this.toggleSignInputShow()
    },

    toggleSignInputShow() {
      this.setData({
        isSignInputShow: !this.data.isSignInputShow,
      })
    },

    handle(e) {
      this.toggleSignInputShow()

      console.log(e.detail)

      const { resultArr } = this.data

      resultArr.push(e.detail)

      this.setData({
        resultArr,
      })
    },
  },
})
