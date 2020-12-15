// pages/login/login.js
var noLogin = require("../template/noLogin.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: true
  },

  toIndex() {
    wx.switchTab({
      url: '../index/index'
    })
  },

  //用户点击按钮发起授权
  WeChatUserInfo: function (e) {
    if (e.detail.userInfo) {
      noLogin.getUserInfo(this).then(() => {
        wx.switchTab({ url: '/pages/index/index' })
      });//用户授权后更新用户数据
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '拒绝微信授权将无法使用部分功能',
        success: res => {
          if (res.confirm) {

          }
        }
      })
    }
  }
})