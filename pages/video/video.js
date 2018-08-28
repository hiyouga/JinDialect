// pages/video/video.js
const app = getApp()
const util = require("../../utils/util.js");
const txvContext = requirePlugin("tencentvideo")

Page({

  data: {
    txvs: []
  },

  onLoad: function () {
    //let player1 = txvContext.getTxvContext('txv1');
    this.getList()
  },

  getList: function () {
    wx.request({
      url: app.globalData.domain + 'query.php',
      data: {
        source: 'video'
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        res.data.forEach(function (value, key, arr) {
          value.date = util.formatDate(value.date)
        })
        this.setData({
          txvs: res.data
        })
      }
    })
  },

})