import { behavior } from '../../behaviors/behaviors.js'

// index.js
const app = getApp()

Component({
  behaviors: [behavior],

  data: {
    name: 'Hello',
  },

  lifetimes: {
    created: async function () {
      console.log(1)
    },
  },

  methods: {
    foo() {},
  },
})
