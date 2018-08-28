// pages/upload/dict.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
   
  startRecoder: function () {
    const recorderManager = wx.getRecorderManager()

    recorderManager.onStart(() => {
      console.log('recorder start')
    })

    recorderManager.onPause(() => {
      console.log('recorder pause')
    })

    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const { tempFilePath } = res
      
    })

    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })

    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }

    recorderManager.start(options)
  },

  uploadFile: function (filepath) {
    wx.uploadFile({
      url: 'https://buaa.hiyouga.top/jsjm/upload.php',
      filePath: filepath,
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: function (res) {
        var data = res.data
        //
      }
    })
  }
})