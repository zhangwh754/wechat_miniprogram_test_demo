// pages/file/file.js
Page({
  handleExport() {
    wx.downloadFile({
      url: 'http://localhost:1337/file/export/1.txt,1689211800552.jpg,hello.txt', //仅为示例，并非真实的资源
      success(res) {
        console.log(res.tempFilePath)
        if (res.statusCode === 200) {
        }
      },
    })
  },
})
