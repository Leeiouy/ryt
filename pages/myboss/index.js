// pages/myboss/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    wechat_num: '',
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
    let that = this;
    wx.request({
      url: app.baseURL + 'Mycenter/userInfo?token=' + wx.getStorageSync('token'),
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          if(res.data.data.above_wechat_num){
            that.setData({
              avatar: res.data.data.above_wxcode,
              wechat_num: res.data.data.above_wechat_num
            })
          }else{
            wx.showModal({
              title: '温馨提示',
              content: 'TA还未上传二维码信息哦T_T',
              showCancel: false,
              confirmText: '我知道了',
            })
          }
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