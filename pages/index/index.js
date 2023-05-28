import { request } from '../../utils/index.js'

Component({
  data: {},

  methods: {
    onShow() {
      console.log('show')
    },

    handleTap() {
      request('加载中', 'test', {
        str: 10,
        // str: 'aaa',
      })
    },
  },
})
