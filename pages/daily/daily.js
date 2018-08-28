// pages/daily/daily.js

const app = getApp()
const util = require("../../utils/util.js");

Page({

  data: {
    urls: []
  },

  onLoad: function (options) {
    this.getList()
  },

  getList: function () {
    wx.request({
      url: app.globalData.domain + 'query.php',
      data: {
        source: 'daily'
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        res.data.forEach(function (value, key, arr) {
          value.date = util.formatDate(value.date)
        })
        this.setData({
          urls: res.data
        })
      }
    })
  },

  openview: function (e) {
    var current_url = this.data.urls[e.currentTarget.dataset.idx]
    wx.navigateTo({
      url: 'webview?url=' + current_url.link + '&title=' + current_url.title,
    })
  }

})