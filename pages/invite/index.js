// pages/invite/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:"",
    qrCode:"",//二维码
  },
  copy(){
    wx.setClipboardData({
      data: this.data.code,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  downLoad(e){
    var that = this;
    var qrCode = that.data.qrCode;
    // var sharetext = e.currentTarget.dataset.text;
    // that.setData({
    //   sharetext: sharetext
    // })
    wx.showLoading({
      title: '图片下载中..',
    })
    var qrCode = qrCode;
    that.dow_temp(qrCode);
  },
  //下载单个内容

  dow_temp: function (qrCode) {
    var that = this;
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success() {
          // 用户已经同意小程序使用相册的授权
          const downloadTask = wx.downloadFile({
            url: qrCode,
            success: function (res) {
              var temp = res.tempFilePath;
              console.info("临时路径", temp)
              wx.saveImageToPhotosAlbum({
                filePath: temp,
                success: function () {
                  //开启分享浮层
                    wx.showToast({
                      title: '已下载完成',
                    })
                },
                fail: function () {
                  that.dow_temp(qrCode);
                }
              })
            },
            fail: function (res) {
              wx.showToast({
                icon: 'none',
                title: '获取图片临时路径失败',
              })
            }
          })
        },
        fail: function () {
          wx.showToast({
            icon: 'none',
            title: '获取授权失败',
          })
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    wx.request({
      url: app.baseURL +'/Mycenter/userInfo?token='+wx.getStorageSync('token'),
      success(res){
        that.setData({
          code: res.data.data.invitation_code,
        })
      }
    })
    wx.request({
      url: app.baseURL + '/Qrcode/getQrcode?token=' + wx.getStorageSync('token'),
      success(res){
        console.log(res);
        if(res.data.code == 1){
          that.setData({
            qrCode:res.data.data.qrcode
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})