import { behavior } from '../../behaviors/behaviors.js'

// index.js
const app = getApp()

Component({
  behaviors: [behavior],

  data: {
    msg: 'Hello',
    list: [],
  },

  lifetimes: {
    created: async function () {},
  },

  methods: {
    foo() {},
  },
})
