// pages/feedback/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  formSubmit(e){
    let that = this
    let content = e.detail.value.content
    if(!content){
      wx.showToast({
        title: '请输入您的意见',
        icon:"none"
      })
      return
    }
    wx.request({
      url: app.baseURL +'/message/setFeedback',
      data:{
        token:wx.getStorageSync('token'),
        content:content
      },
      success(res){
        console.log(res)
        if(res.data.code == 1){
          wx.showToast({
            title: res.data.msg,
          })
          setTimeout(function () {
            wx.navigateBack()
          },1000)
          that.setData({
            value:""
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