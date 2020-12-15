// pages/logintwo/index.js
const app = getApp();
Page({
  data: {
    type: '',
    flag: false   //是否同意协议
  },
  onChange(e){
    console.log(e)
    this.setData({
      flag: e.detail
    });
  },
  formSubmit(e){
    let that = this;
    var phone = e.detail.value.phone, //手机号
      password = e.detail.value.password
    const reg = /^1[23456789]\d{9}$/;
    //进行验证判断
    if (!phone) { this.toast('请输入联系电话'); return; }
    if (!reg.test(phone)) { this.toast('手机号格式不正确'); return; }
    if (!password) { this.toast('请输入密码'); return; }
    wx.request({
      url: app.baseURL + '/User/login',
      data: {
        mobile: phone,
        password: password
      },
      success: res => {
        console.log(res)
        if(res.data.code == 0){
          this.toast(res.data.msg); 
        } else if (res.data.code == 1){
          this.toast(res.data.msg);
          wx.setStorageSync('token', res.data.data.userinfo.token)
          setTimeout(()=>{
            if (that.data.type == 1){
              wx.navigateBack({
                delta: 1
              })
            } else if(that.data.type == 3){
              that.getUserReq();
            } else{
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          },1200)
        }
      }
    })
  },

  getUserReq(){
    wx.request({
      url: app.baseURL + 'Mycenter/userInfo?token=' + wx.getStorageSync('token'),
      success(res) {
        if (res.data.code == 1) {
          if(res.data.data.distributor > 0){
            wx.switchTab({
              url: '/pages/my/index',
            })
          }else{
            wx.navigateBack({
              delta: 1
            })
          }
        }
      }
    })
  },

  //简化提示函数
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
    console.log(options.type)
    if(options.type){
      this.setData({
        type: options.type
      })
    }
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