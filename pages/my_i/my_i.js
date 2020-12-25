// pages/my_i/my_i.js
const app = getApp();

import {
  _myCenter
} from '../../config/https'

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    //---------------------------------
    userInfo: null, //登录保存的头像和昵称
    centerData: null //

  },
  onLoad: function (options) {
    console.log(_myCenter);
  },
  onShow: function () {
    if (this.isLogin()) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }

    this.getData()
  },


  getData() {

    _myCenter({
      token: wx.getStorageSync('token') || ''
    }).then(res => {
      if (res.code == 1) {
        this.setData({
          centerData: res.data
        })
      } else {
        app.Toast('网络错误!')
      }
    })
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
  //跳转地址管理
  toAddress() {
    if (!this.isLogin()) {
      return
    }
    wx.navigateTo({
      url: '/pages/address_i/address_i'
    });
  },
  //跳转设置页面
  toSetting() {
    if (!this.isLogin()) {
      return
    }
    wx.navigateTo({
      url: '/pages/setting/index'
    });
  }
})