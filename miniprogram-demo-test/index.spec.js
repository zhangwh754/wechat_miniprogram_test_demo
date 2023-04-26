const automator = require('miniprogram-automator')

describe('首页启动测试', () => {
  let miniProgram
  let page

  it('判定.title的文本', async () => {
    const desc = await page.$('view.title')
    const msg = 'hello world'
    await page.setData({
      msg,
    })
    expect(desc.tagName).toBe('view')
    expect(await desc.text()).toBe(msg)
  })

  it('判定列表的长度', async () => {
    await page.setData({
      list: Array(15).fill({ msg: 'abc' }),
    })
    const list = await page.$$('view.list > .item')
    expect(list.length).toBe(15)
  })

  // it('赋值', async () => {})

  // 启动并连接工具
  // 重新启动小程序到首页
  beforeAll(async () => {
    miniProgram = await automator.launch({
      cliPath: 'D:/Tencent/微信web开发者工具/cli.bat',
      projectPath: 'E:/project/demo_proejct/小程序测试项目',
    })
    page = await miniProgram.reLaunch('/pages/index/index')
    await page.waitFor(500)
  }, 30000)

  // 断开连接并关闭工具
  afterAll(async () => {
    await miniProgram.close()
  })
})
