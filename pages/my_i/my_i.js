// pages/my_i/my_i.js
const app = getApp();

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    userInfo: null
  },
  onLoad: function (options) {

  },
  onShow: function () {
    if (this.isLogin()) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })


    }


  },

  login() {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  isLogin() {
    if (!wx.getStorageSync('token')) {
      wx.showModal({
        title: '温馨提示',
        content: '您暂未登录，是否要去登录？',
        confirmText: "确定",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',

            })
          }
        }
      })
      return false
    } else {
      return true
    }
  },
  toAddress() {
    if (!this.isLogin()) {
      return
    }
    wx.navigateTo({
      url: '/pages/address_i/address_i'
    });

  }
})