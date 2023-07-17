export default Behavior({
  lifetimes: {
    created() {},
  },

  methods: {
    bindChange(e) {
      const type = e.currentTarget.dataset.type

      this.setData({
        [`${type}`]: e.detail.value,
      })
    },
  },
})
