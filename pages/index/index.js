import { form } from '../../behaviors/index.js'

// pages/father/father.js
Component({
  behaviors: [form],

  observers: {
    'a, b': function (a, b) {
      this.setData({
        c: a + b,
      })
    },

    picker1: function (value) {
      this.setData({
        value1: this.data.dataArr[value].id,
      })
    },
  },

  data: {
    a: 0,
    b: 0,
    c: 0,

    dataArr: [
      { id: '01', label: '中国' },
      { id: '02', label: '美国' },
      { id: '03', label: '日本' },
    ],

    picker1: 0,
  },

  methods: {
    handleAdd(e) {
      const type = e.currentTarget.dataset.type

      this.setData({
        [`${type}`]: this.data[type] + 1,
      })
    },

    handleSubmit(e) {
      console.log(e.detail.value)
    },
  },
})
