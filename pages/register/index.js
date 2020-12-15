// pages/register/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 60, //定时器总秒数
    disable: true, //按钮状态
    mobile: "",
    status:"success" ,  
    color:"#E4592A" ,
    qrcode:""  //邀请码
  },

  mobileInputEvent: function(e) {
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
          type: '2'
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
  submit(e) {
    var mobile = e.detail.value.mobile, //手机号
      code = e.detail.value.code,
      invite_code = e.detail.value.inviteCode,
      password = e.detail.value.password,
      surePassword = e.detail.value.surePassword
    const reg = /^1[23456789]\d{9}$/;
    //进行验证判断
    if (!mobile) {
      this.toast('请输入手机号码');
      return;
    }
    if (!reg.test(mobile)) {
      this.toast('手机号格式不正确');
      return;
    }
    if (!code) {
      this.toast('请输入验证码');
      return;
    }
    if (!password) {
      this.toast('请输入密码');
      return;
    }
    if (password != surePassword) {
      this.toast('两次密码不一致');
      return
    }
    if(this.data.status == 'circle'){
      this.toast('请点击同意日悦淘用户协议')
      return
    }
    wx.request({
      url: app.baseURL + '/User/register',
      data: {
        mobile: mobile,
        password: password,
        confirm_password: surePassword,
        code: code,
        invite_code: invite_code
      },
      success: res => {
        console.log(res)
        let data = res.data
        if (data.code == 0) {
          this.toast(data.msg, false)
        } else if (data.code == 1) {
          wx.showToast({
            title: res.data.msg,
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/logintwo/index',
            })
          }, 1000)
        }
      }
    })
  },

  toLogin() {
    wx.reLaunch({
      url: '../logintwo/index',
    })
  },
  toast(msg, isico) {
    wx.showToast({
      title: msg,
      icon: isico ? 'success' : 'none'
    })
  },
  //点击同意
  agree(){
    this.setData({
      status:'success',
      color:'#E4592A'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      let scene = decodeURIComponent(options.scene)
      this.setData({
        qrcode:scene
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})