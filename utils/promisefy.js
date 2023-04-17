import { promisifyAll, promisify } from 'miniprogram-api-promise'

const wxp = {}
// promisify all wx's api
promisifyAll(wx, wxp)
// console.log(wxp.getSystemInfoSync())
// wxp.getSystemInfo().then(console.log)
// wxp.showModal().then(wxp.openSetting())

// promisify single api
// promisify(wx.getSystemInfo)().then(console.log)

export default wxp
