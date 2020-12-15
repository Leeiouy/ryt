// pages/changenickname/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickName:options.nickName
    })
  },
  formSubmit(e){
    let that = this
    if(!e.detail.value.name){
      wx.showToast({
        title: '请设置昵称',
      })
      return
    }
    if(e.detail.value.name.length > 15){
      wx.showToast({
        title: '昵称长度应小于15',
        icon:"none"
      })
      return
    }
    wx.request({
      url: app.baseURL + '/user/profile',
      data:{
        token:wx.getStorageSync('token'),
        username:e.detail.value.name
      },
      success(res){
        if(res.data.code == 0){
           wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }else if(res.data.code == 1){
          wx.redirectTo({
            url: '../myinformation/index?nickName=' + e.detail.value.name,
          })
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
   
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