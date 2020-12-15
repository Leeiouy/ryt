// pages/setting/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  exit(){
    wx.request({
      url: app.baseURL +'/user/logout?token=' + wx.getStorageSync('token'),
      success(res){
        console.log(res)
        if (res.data.code == 1) {
          wx.clearStorageSync('token')
          wx.reLaunch({
            url: '../logintwo/index',
          })
        }else if(res.data.code == 0){
          wx.showToast({
            title: res.data.msg,
            icon:"none"
          })
        }
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
    wx.request({
      url: app.baseURL +'/Mycenter/member_set?token='+wx.getStorageSync('token'),
      success(res){
        console.log(res)
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