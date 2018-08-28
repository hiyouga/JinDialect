const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: datestr => {
    var tempArr = datestr.split('-')
    return tempArr[0] + '年' + tempArr[1] + '月' + tempArr[2] + '日'
  },
  getmscreenWidth: function() { // rpx 转 px
    let mscreenWidth = 0;
    wx.getSystemInfo({
      success: function (res) {
        mscreenWidth = res.screenWidth
      },
    });
    return mscreenWidth / 750;
  },
  copyObj: function (obj) {
    if (typeof obj != 'object') {
      return obj;
    }
    var newobj = {};
    for (var attr in obj) {
      newobj[attr] = this.copyObj(obj[attr]);
    }
    return newobj;
  }
}