import { request } from '../../utils/index'

Page({
  data: {
    avatarAuto: 'http://192.168.1.69:1337/file/1690529790114.jpg', // 系统头像
    avatarUser: 'http://192.168.1.69:1337/file/1690529790095.jpg', // 用户头像
    isAnimation: true, // 是否开启动画
    viewHeight: 0, // 设置scroll-view的高度
    canSend: false, // 是否可发送
    chatDataArray: [
      {
        Content: '你好',
        ContentType: 1,
        FileRealName: '',
        UserType: 2,
      },
      {
        Content: '世界',
        ContentType: 1,
        FileRealName: '',
        UserType: 1,
      },
      {
        Content: '',
        ContentType: 2,
        FileRealName: '承太郎打爆Dio.mp4',
        UserType: 1,
      },
    ], // 对话内容
    useMsg: '', // 用户输入框内的信息
    toView: 'toFooter', // 定位到底部，用于处理消息容器滑动到最底部

    PageIdx: 0,
  },

  onLoad() {
    this.getBtnHeight() // 处理 设备可显示高度
  },

  onReady() {
    this.animation = wx.createAnimation() // 创建动画。
  },

  async getMsgList() {
    const param = {
      OrderIdStr: this.dataInfo.OrderId,
      PageIdx: this.data.PageIdx,
      PageLimit: 10,
    }

    let chatDataArray = this.data.chatDataArray

    try {
      const res = await request('加载中', '/GetWtly', param)

      if (res.Tag != 1) throw res.Message

      chatDataArray = [
        ...res.Data.WtlyDatas.map(item => ({
          Content: item.Content,
          UserType: item.UserType,
          ContentType: item.ContentType,
          FileRealName: item.FileRealName,
          IdLyStr: item.IdLyStr,
          Name: item.Name,
        })),
        ...chatDataArray,
      ]

      this.TotalPage = res.Data.TotalPage

      this.setData({
        chatDataArray,
      })

      this.data.PageIdx += 1
    } catch (error) {
      console.log(error)
    }
  },

  // 发送聊天信息
  async pushChatMsg(e) {
    const canSend = this.data.canSend
    if (canSend) {
      let useMsg = this.data.useMsg,
        chatDataArray = this.data.chatDataArray

      let chatData = { UserType: 1, Content: useMsg, ContentType: 1 },
        oldChatDataArray = chatDataArray.concat(chatData)
      this.setData({ useMsg: '', canSend: false, chatDataArray: oldChatDataArray })
      this.tapMove() // 执行第一次滑动 定位到底部

      // if (!(await this.sendChatMsg(useMsg))) {
      //   // 修饰动画 - 发送失败
      //   const i = oldChatDataArray.length - 1
      //   oldChatDataArray[i].Content = '发送失败'
      //   this.setData({ chatDataArray: oldChatDataArray })
      //   this.tapMove() // 执行第二次滑动 定位到底部
      // }
    } else {
      console.log('当前还不能发送')
    }
  },

  // 聊天消息发送接口
  async sendChatMsg(Content) {
    const UserId = wx.getStorageSync('userIdWZHBG')

    const param = {
      OrderIdStr: this.dataInfo.OrderId,
      UserId: UserId,
      Phone: this.dataInfo.JbrPhone,
      ContentType: 1,
      Content: Content,
      FileList: [],
    }

    try {
      const res = await request('发送中', '/SaveWtly', param)

      if (res.Tag != 1) throw res.Message

      return true
    } catch (error) {
      console.log(error)

      return false
    }
  },

  pushUploadMsg() {
    let useMsg = this.data.useMsg,
      chatDataArray = this.data.chatDataArray

    let chatData = { UserType: 1, FileRealName: useMsg, ContentType: 2 },
      oldChatDataArray = chatDataArray.concat(chatData)
    this.setData({ useMsg: '', canSend: false, chatDataArray: oldChatDataArray })
    this.tapMove() // 执行第一次滑动 定位到底部
  },

  fileUpload() {
    const UserId = wx.getStorageSync('userIdWZHBG')

    wx.navigateTo({
      url: '/packageK/pages/upload/upload',
      success: res => {
        res.eventChannel.emit('dataInfo', {
          OrderId: this.dataInfo.OrderId,
          JbrPhone: this.dataInfo.JbrPhone,
          UserId: UserId,
        })
      },
    })
  },

  // 滑动到顶部
  handleScroll() {
    if (this.data.PageIdx < this.TotalPage) {
      this.getMsgList()
    }
  },

  // 监听 滑动事件
  scroll(e) {
    console.log(e)
  },

  // 处理 滑动到底部 动效
  tapMove() {
    this.setData({ toView: 'toFooter' })
  },

  // 监听 底部输入框
  bindInputValue(e) {
    const useMsg = e.detail.value
    if (useMsg.length !== 0) {
      this.setData({ useMsg, canSend: true })
    } else {
      this.setData({ canSend: false })
    }
  },

  // 处理 设备可显示高度
  getBtnHeight: function () {
    const that = this,
      query = wx.createSelectorQuery()
    query.select('#footerBtnGroup').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      const _h = res[0].height * 2 - 15
      let windowHeight = wx.getSystemInfoSync().windowHeight
      let windowWidth = wx.getSystemInfoSync().windowWidth
      const viewHeight = parseInt((750 * windowHeight) / windowWidth - _h)
      that.setData({ viewHeight })
      that.tapMove()
    })
  },
})
