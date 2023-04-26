import { emitData } from '../../utils/index.js'

Component({
  data: {
    pickerHidden: true,
    chosen: '',
  },

  lifetimes: {
    created() {
      console.log(emitData.userInfo)
    },
  },

  methods: {
    pickerConfirm(e) {
      this.setData({
        pickerHidden: true,
      })
      this.setData({
        chosen: e.detail.value,
      })
    },

    pickerCancel() {
      this.setData({
        pickerHidden: true,
      })
    },

    pickerShow() {
      this.setData({
        pickerHidden: false,
      })
    },

    formSubmit(e) {
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
    },

    formReset(e) {
      console.log('form发生了reset事件，携带数据为：', e.detail.value)
      this.setData({
        chosen: '',
      })
    },
  },
})
