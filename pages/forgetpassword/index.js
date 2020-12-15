// pages/forgetpassword/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 60, //定时器总秒数
    disable: true, //按钮状态
    mobile: ""
  },


  mobileInputEvent: function (e) {
    this.setData({
      // 手机号码
      mobile: e.detail.value
    })
  },
  getCode(e) {
    let time = this.data.time, //定时器秒数
      timer; //定时器
    var mobile = this.data.mobile;
    var regMobile = /^1[23456789]\d{9}$/;
    if (!regMobile.test(mobile)) {
      this.toast('手机号有误！')
      return false;
    } else {
      wx.request({
        url: app.baseURL + '/user/send_code',
        data: {
          mobile: mobile,
          type: '3'
        },
        success: (res) => {
          console.log(res)
          let data = res.data;
          if (data.code === 0) {
            // if (data.info.http_status_code == 400) {
            wx.showModal({
              title: '提示',
              content: data.msg,
              showCancel: false,
            })
            // } else {
            //   this.toast(data.info)
            // }
          } else if (data.code === 1) {
            this.toast(data.msg, true);
            this.setData({
              disable: false
            });
            timer = setInterval(() => {
              //倒计时到0时，清除定时器，按钮可点击状态
              if (time == 0) {
                clearInterval(timer);
                this.setData({
                  time: 60,
                  disable: true
                });
                //秒数递减  
              } else {
                time--;
                this.setData({
                  time: time
                });
              }
            }, 1000);
          };
        }
      })
    }
  },
  formSubmit(e){
    var mobile = e.detail.value.mobile, //手机号
      code = e.detail.value.code,
      password = e.detail.value.password,
      surePassword = e.detail.value.confirm
    const reg = /^1[23456789]\d{9}$/;
    //进行验证判断
    if (!mobile) { this.toast('请输入手机号码'); return; }
    if (!reg.test(mobile)) { this.toast('手机号格式不正确'); return; }
    if (!code) { this.toast('请输入验证码'); return; }
    if (!password) { this.toast('请输入密码'); return; }
    if (password.length < 6 || password.length>15) { this.toast('密码应在6-16位之间'); return; }
    if (password != surePassword) { this.toast('两次密码不一致'); return;}
    wx.request({
      url: app.baseURL + '/User/forget_pwd',
      data: {
        mobile: mobile,
        newpassword: password,
        confirm_password: surePassword,
        captcha: code,
      },
      success: res => {
        console.log(res)
        let data = res.data
        if (data.code == 0) {
          this.toast(data.msg, false)
        } else if (data.code == 1) {
          // this.toast(data.msg,true)
          wx.showModal({
            title: '提示',
            content: data.msg,
            confirmText: '去登录',
            success(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../logintwo/index',
                })
              }
            }
          })
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