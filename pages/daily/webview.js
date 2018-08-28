// pages/daily/webview.js
Page({

  data: {
    current_url: ''  
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({
      current_url: options.url
    })
  }  
})