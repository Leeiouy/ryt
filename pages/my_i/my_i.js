// pages/my_i/my_i.js
const app = getApp();

import {
  _myCenter,
  _myUserInfo
} from '../../config/https'

Page({
  data: {
    CustomBar: app.globalData.CustomBar,//距离底部高度
    //---------------------------------
    userInfo: null, //登录保存的头像和昵称
    centerData: null //个人信息

  },
  onLoad: function (options) {},
  onShow: function () {
    this.getData()
    this.getUserInfo()
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

  getUserInfo() {
    _myUserInfo({
      token: wx.getStorageSync('token') || ''
    }).then(res => {
      if (res.code == 1) {
        this.setData({
          userInfo: res.data
        })
      }
      console.log(res);
    })

  },




  //点击头像 未登录跳转登录页面 已登录跳转个人信息页面
  tapAavatar() {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: '/pages/myinformation/index',
      })
    }
  },


























  // 到订单
  toOrder(e) {
    if (!this.isLogin()) {
      return
    }
    const state = e.currentTarget.dataset.state,
      type = e.currentTarget.dataset.type;
    console.log(state, type)
    wx.navigateTo({
      url: '/pages/order/index?state=' + state + '&type=' + type
    })
  },






  //------------------------是否登录---------------------------

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


  //------------------------功能跳转---------------------------

  // 去银行卡
  toCard() {
    if (!this.isLogin()) {
      return
    }
    wx.navigateTo({
      url: '/pages/myCard/index',
    })
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
  //去分享
  toInvite() {
    if (!this.isLogin()) {
      return
    }
    wx.navigateTo({
      url: '/pages/invite/index',
    })
  },
  //去意见反馈
  toFeedback() {
    if (!this.isLogin()) {
      return
    }
    wx.navigateTo({
      url: '/pages/feedback/index',
    })
  },

  //去关于我们
  toAbout() {
    if (!this.isLogin()) {
      return
    }
    wx.navigateTo({
      url: '/pages/about/index',
    })
  },

  //到收藏
  toCollect() {
    if (!this.isLogin()) {
      return
    }
    wx.navigateTo({
      url: '/pages/mycollect/index'
    })
  },

  //跳转设置页面
  toSetting() {
    if (!this.isLogin()) {
      return
    }
    wx.navigateTo({
      url: '/pages/setting/index'
    });
  },




  outLogin() {
    wx.showModal({
      title: '提示',
      content: '您确认要退出登录？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          wx.clearStorageSync();
          app.Toast('退出登录成功!', 'success')
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index_i/index_i'
            });
          }, 1500);
        }
      },
    });

  }
})