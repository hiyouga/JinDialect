// pages/favs/favs.js

const util = require("../../utils/util.js");
const app = getApp()

Page({
  player: undefined,

  /**
   * 页面的初始数据
   */
  data: {
    mnavbarsArr: ["词语", "句子"],
    activeIndex: 0,
    mtranslatex: 0,
    fav_dict: [],
    fav_sents: []
  },

  onLoad: function () {
    this.setData({
      mtranslatex: util.getmscreenWidth() * 145
    })
  },

  onShow: function () {
    this.setData({
      fav_dict: app.globalData.fav_dict,
      fav_sents: app.globalData.fav_sents
    })
  },

  mnavbarclik: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    })
    if (e.currentTarget.id == 0) {
      this.setData({
        mtranslatex: util.getmscreenWidth() * 145,
      })
    }
    if (e.currentTarget.id == 1) {
      this.setData({
        mtranslatex: util.getmscreenWidth() * 520,
      })
    }
  },

  playaudio: function (e) {
    var ln = ''
    if (this.data.activeIndex == 1) {
      ln = 'fav_sents'
    } else {
      ln = 'fav_dict'
    }
    if (this.player != undefined) {
      this.setData({
        [ln + '[' + this.player.id + '].play']: 0
      })
      this.player.destroy()
      this.player = undefined
    }
    this.player = wx.createInnerAudioContext()
    this.player.id = e.currentTarget.dataset.idx
    this.player.autoplay = true
    this.player.src = app.globalData.domain + 'sounds/' + e.currentTarget.dataset.href
    this.player.onPlay(() => {
      this.setData({
        [ln + '[' + this.player.id + '].play']: 1
      })
    })
    this.player.onEnded(() => {
      this.setData({
        [ln + '[' + this.player.id + '].play']: 0
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

  del_fav: function (e) {
    var ln = ''
    if (this.data.activeIndex == 1) {
      ln = 'fav_sents'
    } else {
      ln = 'fav_dict'
    }
    wx.showModal({
      title: '提示',
      content: '您确定要删除该收藏吗',
      success: status => {
        if (status.confirm) {
          app.globalData[ln].splice(e.currentTarget.dataset.idx, 1)
          this.setData({
            [ln]: app.globalData[ln]
          })
          wx.setStorage({
            key: ln,
            data: app.globalData[ln]
          })
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      }
    })
  }
})