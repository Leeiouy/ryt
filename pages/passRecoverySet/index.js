// pages/passRecoverySet/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //数据提交
  formsubmit(e) {
    let that = this
    const password = e.detail.value.password,
      passwordAgin = e.detail.value.passwordAgin,
      original_password = e.detail.value.original
    //基本验证  
    if (!original_password) { that.toast('请输入原密码'); return; }
    if (!password) { that.toast('请设置密码'); return; }
    if (password.length < 6 || password.length > 15) { that.toast('支付密码长度为6-15位'); return; }
    if (password != passwordAgin) { that.toast('两次密码不一样，请重新输入'); return; }
    //如果是修改支付密码
    let data = {
      token: wx.getStorageSync('token'), //用户id
      type:'1',
      original_password: original_password, 
      password: password, //确认密码
      confirm_password: passwordAgin
    }
    wx.request({
      url: app.baseURL +'/Mycenter/edit_password',
      data:data,
      success(res){
        if(res.data.code == 1){
          that.toast(res.data.msg)
          setTimeout(function(){
            wx.navigateBack()
          },1000)
        }else if(res.data.code == 0){
          that.toast(res.data.msg)
        }
      }
    })
  },

  //提示弹窗
  toast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none'
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