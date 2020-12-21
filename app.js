//app.js
App({
  baseURL: 'https://ptlf.0791jr.com/api/',
  onLaunch: function (options) {
    this.isShare = false;
    if (options.query.other_user_id) {
      // 如果好友分享进入或者群聊分享进入
      options.query.type == 1 && (this.invitation = true)
      this.isShare = true;
      this.other_id = options.query.other_user_id;
    }


    this.getLoginStatus()
    this.upDataWxApp()

  },

  //获取登录状态是否过期
  getLoginStatus() {
    wx.checkSession({
      success() {
        
      },
      fail() {
        wx.clearStorageSync();
        // wx.showModal({
        //   title: '提示',
        //   content: '登录状态已经失效，请重新登录!',
        //   showCancel: false,
        //   confirmText: '确定',
        //   confirmColor: '#3CC51F',
        //   success: (result) => {
        //     if (result.confirm) {
        //       wx.reLaunch({
        //         url: 'pages/login/login'
        //       });
        //     }
        //   }
        // });
      }
    })

  },
  //获取小程序最新版本
  upDataWxApp() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          res.confirm && updateManager.applyUpdate()
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },





  tips(str) {
    wx.showToast({
      title: str,
      icon: 'none',
      duration: 1000
    })
  },

  Toast(title, icon = 'none', mask = true, duration = 1500) {
    wx.showToast({
      title,
      icon,
      duration,
      mask,
    });
  },
  //全局信息
  globalData: {
    stock_alarm: 10, //即将售完提示线
    title: "小程序", //小程序标题
    userInfo: null, //用户信息
    token: wx.getStorageInfoSync('token'), //用户id
    imgBaseUrl: 'https://ptlf.0791jr.com'
  }
})
// "navigationBarBackgroundColor": "#E4592A",
// "navigationBarTextStyle": "white"