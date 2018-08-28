//app.js
App({
  onLaunch: function () {
    var _this = this
    var vns = ['his_dict', 'his_sents', 'fav_dict', 'fav_sents']
    vns.forEach(function (val, key, arr) {
      _this.recovery(val)
    })
  },

  recovery: function (vn) {
    wx.getStorage({
      key: vn,
      success: res => {
        this.globalData[vn] = res.data
      }
    })
  },

  globalData: {
    domain: 'https://buaa.hiyouga.top/jsjm/',
    limit: 20,
    his_dict: [],
    his_sents: [],
    fav_dict: [],
    fav_sents: []
  }
})