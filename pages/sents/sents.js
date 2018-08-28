// pages/sents/sents.js
const app = getApp()
const util = require("../../utils/util.js")

Page({
  hasMore: true,

  player: undefined,

  data: {
    sents: [],
    offset: 0
  },

  onLoad: function (options) {
    this.getList()
  },

  getList: function () {
    var _this = this
    wx.request({
      url: app.globalData.domain + 'query.php',
      data: {
        source: 'sents',
        limit: app.globalData.limit,
        offset: app.globalData.limit * _this.data.offset
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        if (res.data.length == 0) {
          _this.hasMore = false
        } else {
          this.setData({
            sents: _this.data.sents.concat(res.data)
          })
        }
        wx.hideLoading()
      }
    })
  },

  playaudio: function (e) {
    if (this.player != undefined) {
      this.setData({
        ['sents[' + this.player.id + '].play']: 0
      })
      this.player.destroy()
      this.player = undefined
    }
    this.addHistory(e.currentTarget.dataset.idx)
    this.player = wx.createInnerAudioContext()
    this.player.id = e.currentTarget.dataset.idx
    this.player.autoplay = true
    this.player.src = app.globalData.domain + 'sounds/' + e.currentTarget.dataset.href
    this.player.onPlay(() => {
      this.setData({
        ['sents[' + this.player.id + '].play']: 1
      })
    })
    this.player.onEnded(() => {
      this.setData({
        ['sents[' + this.player.id + '].play']: 0
      })
      this.player.destroy()
      this.player = undefined
    })
  },

  pauseaudio: function (e) {
    if (this.player.paused) {
      this.player.play()
    } else {
      this.player.pause()
    }
  },

  addHistory: function (idx) {
    var tempSent = util.copyObj(this.data.sents[idx])
    tempSent.play = 0
    app.globalData.his_sents.forEach(function (value, key, arr) {
      if (value.sid == tempSent.sid) {
        app.globalData.his_sents.splice(key, 1)
      }
    })
    app.globalData.his_sents.unshift(tempSent)
    while (app.globalData.his_sents.length > 7) {
      app.globalData.his_sents.pop()
    }
    wx.setStorage({
      key: 'his_sents',
      data: app.globalData.his_sents
    })
  },

  add_fav: function (e) {
    wx.showModal({
      title: '提示',
      content: '您确定要收藏该句子吗',
      success: status => {
        if (status.confirm) {
          var is_exist = false
          var tempSent = util.copyObj(this.data.sents[e.currentTarget.dataset.idx])
          tempSent.play = 0
          app.globalData.fav_sents.forEach(function (value, key, arr) {
            if (value.sid == tempSent.sid) {
              wx.showToast({
                title: '句子已存在',
                icon: 'none',
                duration: 1000,
                mask: true
              })
              is_exist = true
            }
          })
          if (!is_exist) {
            app.globalData.fav_sents.push(tempSent)
            wx.setStorage({
              key: 'fav_sents',
              data: app.globalData.fav_sents
            })
            wx.showToast({
              title: '收藏成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        }
      }
    })
  },

  onReachBottom: function () {
    if (this.hasMore) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this.setData({
        offset: this.data.offset + 1
      })
      this.getList()
    }
  }
  
})