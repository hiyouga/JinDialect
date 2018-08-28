// pages/dict/dict.js
const app = getApp()
const util = require("../../utils/util.js")

var hasMore = true

Page({
  hasMore: true,

  player: undefined,

  data: {
    words: [],
    showWords: [],
    categories: [],
    cateIndex: 0,
    types: [],
    fulltypes: [],
    typeIndex: 0,
    offset: 0
  },

  onLoad: function(options) {
    this.getList()
    this.getCategory()
    this.getType()
  },

  getList: function() {
    var _this = this
    wx.request({
      url: app.globalData.domain + 'query.php',
      data: {
        source: 'dict',
        limit: app.globalData.limit,
        offset: app.globalData.limit * _this.data.offset
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        if (res.data.length == 0) {
          wx.hideLoading()
          _this.hasMore = false
        } else {
          this.setData({
            words: _this.data.words.concat(res.data)
          })
          this.changeFilter()
        }
      }
    })
  },

  getCategory: function() {
    wx.request({
      url: app.globalData.domain + 'query.php',
      data: {
        source: 'category'
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        res.data.unshift('（词语标签）')
        this.setData({
          categories: res.data
        })
      }
    })
  },

  getType: function() {
    wx.request({
      url: app.globalData.domain + 'query.php',
      data: {
        source: 'types'
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        var types = []
        var fulltypes = []
        res.data.forEach(function(val, key, arr) {
          types.push(val.name)
          fulltypes.push(val.name + '（' + val.region + '）')
        })
        types.unshift('（方言种类）')
        fulltypes.unshift('（方言种类）')
        this.setData({
          types: types,
          fulltypes: fulltypes
        })
      }
    })
  },

  changeCate: function(e) {
    this.setData({
      cateIndex: e.detail.value
    })
    this.changeFilter()
  },

  changeType: function(e) {
    this.setData({
      typeIndex: e.detail.value
    })
    this.changeFilter()
  },

  changeFilter: function() {
    var cateIndex = this.data.cateIndex
    var cate = ''
    if (cateIndex) {
      cate = this.data.categories[cateIndex]
    }
    var typeIndex = this.data.typeIndex
    var typ = ''
    if (typeIndex) {
      typ = this.data.types[typeIndex]
    }
    var newArr = []
    this.data.words.forEach(function(val, key, arr) {
      if (cateIndex == 0 || cate == val.category) {
        if (typeIndex == 0 || typ == val.type) {
          newArr.push(val)
        }
      }
    })
    this.setData({
      showWords: newArr
    })
    wx.hideLoading()
  },

  playaudio: function(e) {
    if (this.player != undefined) {
      this.setData({
        ['showWords[' + this.player.id + '].play']: 0
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
        ['showWords[' + this.player.id + '].play']: 1
      })
    })
    this.player.onEnded(() => {
      this.setData({
        ['showWords[' + this.player.id + '].play']: 0
      })
      this.player.destroy()
      this.player = undefined
    })
  },

  pauseaudio: function(e) {
    if (this.player.paused) {
      this.player.play()
    } else {
      this.player.pause()
    }
  },

  addHistory: function(idx) {
    var tempWord = util.copyObj(this.data.showWords[idx])
    tempWord.play = 0
    app.globalData.his_dict.forEach(function(value, key, arr) {
      if (value.wid == tempWord.wid) {
        app.globalData.his_dict.splice(key, 1)
      }
    })
    app.globalData.his_dict.unshift(tempWord)
    while (app.globalData.his_dict.length > 7) {
      app.globalData.his_dict.pop()
    }
    wx.setStorage({
      key: 'his_dict',
      data: app.globalData.his_dict
    })
  },

  add_fav: function(e) {
    wx.showModal({
      title: '提示',
      content: '您确定要收藏本词条吗',
      success: status => {
        if (status.confirm) {
          var is_exist = false
          var tempWord = util.copyObj(this.data.showWords[e.currentTarget.dataset.idx])
          tempWord.play = 0
          app.globalData.fav_dict.forEach(function(value, key, arr) {
            if (value.wid == tempWord.wid) {
              wx.showToast({
                title: '词条已存在',
                icon: 'none',
                duration: 1000,
                mask: true
              })
              is_exist = true
            }
          })
          if (!is_exist) {
            app.globalData.fav_dict.push(tempWord)
            wx.setStorage({
              key: 'fav_dict',
              data: app.globalData.fav_dict
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

  onReachBottom: function() {
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