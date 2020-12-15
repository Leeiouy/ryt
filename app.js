//app.js
App({
  baseURL:'https://ptlf.0791jr.com/api/',
  // baseURL: 'https://riyuetaoguoji.com/api/',       //线上
  // baseURL: 'https://riyuetaoguoji.0791jr.com/api/',       //test
  onLaunch: function (options) {
    // wx.hideTabBar()
    this.isShare = false;
    if (options.query.other_user_id) {
      // 如果好友分享进入或者群聊分享进入
      options.query.type == 1 && (this.invitation = true)
      this.isShare = true;
      this.other_id = options.query.other_user_id;
    }


    //检测用户的登录态
    wx.checkSession({
      success: (res) => {
        //登录态未过期，并且在本生命周期一直有效
        var value = wx.getStorageSync('userId');
        if (value) {
          this.globalData.userId = value;
          // var car_num = wx.getStorageSync('car_num');
          // if (car_num - 0 > 0) {
          //   this.setBadge(2, car_num)
          // }
        } else {
          //未登录或者本地存储没有信息，重新发起登录
        }

      },
      fail: (err) => {
      }
    })

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
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
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
  //全局信息
  globalData: {
    stock_alarm: 10, //即将售完提示线
    title: "日悦淘", //小程序标题
    userInfo: null, //用户信息
    token: wx.getStorageInfoSync('token'), //用户id
    imgBaseUrl: 'http://riyuetaoguoji.0791jr.com'
  }
})