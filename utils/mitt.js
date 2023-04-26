import mitt from '../lib/mitt'

const emitter = mitt()

const emitData = {
  userInfo: {},
}

emitter.on('foo', res => {
  emitData.userInfo = res
})

export { emitter, emitData }
