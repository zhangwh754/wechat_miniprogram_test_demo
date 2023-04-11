export const behavior = Behavior({
  options: {
    addGlobalClass: true,
  },
  lifetimes: {
    created() {
      let num = 0
      num += 1
      console.log('behavior')
    },
  },
})
