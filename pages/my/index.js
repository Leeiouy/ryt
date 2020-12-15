// pages/my/index.js
const https = require('../../config/https')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin: true, //是否登录
    info: "", //用户信息
    isShow: true,
    data: "",
    buyList: "",
    purch_item: "", //商品类
    currentId: "", //我要购买选中id
    orders: [], //订单图标
    imgArr: [],
    level: "", //用户等级
    height: "", //液面高度
  },

  getStatus() {
    https.healthProxyStatus({
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 1) {
        let level = res.data[1]
        let proxyBg = res.data[2]
        this.setData({
          proxyBg
        })
        wx.setStorageSync('levelList', level)
        if (!res.data[0]) {
          this.setData({
            status: -1
          })
        } else {
          this.setData({
            status: res.data[0].status
          })

        }
      }
    })
  },


  shortcut(e) {
    let id = e.currentTarget.dataset.id
    switch (id) {
      case 98:
        this.toAchievement()
        break;
      case 100:
        this.toMyteam()
        break;
      case 115:
        this.toBoss()
        break;
      case 116:
        this.see()
        break;
      case 99:
        this.tocollect()
        break;
      case 101:
        this.toCart()
        break;
      case 102:
        this.toMyintegral()
        break;
      case 103:
        this.toManageRank()
        break;
      case 104:
        this.showWant()
        break;
      case 105:
        this.toSetting()
        break;
      case 123:
        this.toAchievementHealth()
        break;
      case 122:
        this.proxyVerify()
        break;
      case 124:
        this.toMyteamHealth()
        break;
      case 125:
        this.toHealthBoss()
        break;
      case 126:
        this.toVerifyPaper()
        break;
      case 127:
        this.toProxy()
        break;
      case 999:
        this.toCode()
        break;
    }
  },

  toProxy() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    // console.log(this.data.status);return
    if (this.data.data.info.distributor == 0 && this.data.status != 10) {
      wx.navigateTo({
        url: '/pages/health/proxy/proxy?status=' + this.data.status + '&proxyBg=' + this.data.proxyBg,
      })
    } else {
      wx.showToast({
        title: '你已经是大健康代理！',
        icon: 'none'
      })
      wx.removeStorageSync('levelList')
    }
  },

  toVerifyPaper() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    let data = this.data.info
    wx.navigateTo({
      url: `/pages/health/verifyPaper/verifyPaper?level=${data.distributor}&username=${data.username}`,
    })
  },

  toHealthBoss() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    if (this.data.info.distributor < 3) {
      wx.navigateTo({
        url: '/pages/health/boss/boss',
      })
    } else {
      wx.showToast({
        title: '您已经是最高等级大健康分销商！',
        icon: 'none'
      })
    }
  },

  proxyVerify() {
    wx.navigateTo({
      url: '/pages/health/proxyVerify/proxyVerify',
    })
  },

  see() { //查看授权书
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    let data = this.data.info
    wx.navigateTo({
      url: `/pages/empower/empower?level=${data.level}&username=${data.username}`,
    })
  },
  // 到邀请
  toInvite() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    wx.navigateTo({
      url: '../invite/index',
    })
  },

  // 到订单
  toOrder(e) {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    const state = e.currentTarget.dataset.state,
      type = e.currentTarget.dataset.type;
    console.log(state, type)
    wx.navigateTo({
      url: '/pages/order/index?state=' + state + '&type=' + type
    })
  },
  showWant(e) {
    if (!this.data.hasLogin) {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
      return
    }
    this.setData({
      isShow: false
    })
  },

  // 到售后订单
  toAfterOrder() {
    if (!this.data.hasLogin) {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
      return
    }
    wx.navigateTo({
      url: '../orderaftersale/index',
    })
  },

  closeDialog(e) {
    this.setData({
      isShow: true
    })
  },

  // 到业绩
  toAchievement() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    wx.navigateTo({
      url: '../myAchieve/index',
    })
  },

  // 到大健康业绩
  toAchievementHealth() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    wx.navigateTo({
      url: '../myAchieveHealth/myAchieveHealth',
    })
  },

  // 到购物车
  toCart(e) {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    wx.navigateTo({
      url: '../shoppingcart/index',
    })
  },
  // 到我的团队
  toMyteam(e) {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    wx.navigateTo({
      url: '../myteam/index',
    })
  },

  // 到大健康我的团队
  toMyteamHealth(e) {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    wx.navigateTo({
      url: '/pages/health/team/team',
    })
  },

  // 到我的上级
  toBoss() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    wx.navigateTo({
      url: '../myboss/index',
    })
  },

  // 到我的二维码
  toCode() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    wx.navigateTo({
      url: '../mycode/index',
    })
  },

  // 到我的收藏
  tocollect() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    wx.navigateTo({
      url: '../mycollect/index',
    })
  },
  // 去我的积分
  toMyintegral() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    wx.navigateTo({
      url: '../myintegral/index',
    })
  },
  // 到银行卡管理
  toManageRank() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    wx.navigateTo({
      url: '../myCard/index',
    })
  },
  // 到设置
  toSetting() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
      })
      return
    }
    wx.navigateTo({
      url: '../setting/index',
    })
  },

  choseItem(e) {
    this.setData({
      purch_item: e.currentTarget.dataset.item,
      currentId: e.currentTarget.dataset.id,
    })
  },

  formSubmit(e) {
    let that = this
    let purch_item = that.data.purch_item
    if (!purch_item) {
      wx.showToast({
        title: '请选择商品类',
        icon: "none"
      })
      return
    }
    wx.request({
      url: app.baseURL + '/message/purch_item',
      data: {
        token: wx.getStorageSync('token'),
        purch_item: purch_item,
        content: e.detail.value.mark
      },
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          wx.showToast({
            title: res.data.msg,
          })
          that.setData({
            isShow: true
          })
        } else if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    this.getUser()
    if (!wx.getStorageSync('token')) {
      this.setData({
        hasLogin: false
      })
    } else {
      this.getBuy()
      this.getStatus()

      this.setData({
        hasLogin: true
      })

      wx.request({
        url: app.baseURL + 'Mycenter/userInfo?token=' + wx.getStorageSync('token'),
        success(res) {
          if (res.data.code == 1) {
            that.setData({
              level: res.data.data.level,
              userData: res.data.data,
            })
          }
        }
      })
    }

  },
  getUser() {
    let that = this
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '请稍等...',
      mask: true
    });
    wx.getSystemInfo({
      success: function (res) {
        if (res.model.search('iPhone 6') != -1) {
          that.setData({
            height: '143' + 'vh'
          })
        } else if (res.model.search('iPhone X') != -1) {
          that.setData({
            height: '125' + 'vh'
          })
        }
      },
    })
    const token = wx.getStorageSync('token')
    https.centerInfo({
      token: wx.getStorageSync('token'),
    }).then(res => {
      console.log(res)
      if (res.code == 1) {
        console.log(res)
        let orders = res.data.order_module
        let serviceList = res.data.service_module
        let bighealthList = res.data.bighealth_module
        let toolList = res.data.tool_module
        that.setData({
          info: res.data.info,
          level: Number(res.data.info.level),
          data: res.data,
          orders,
          serviceList,
          bighealthList,
          toolList
        })
        app.globalData.level = res.data.info.level;
      } else if (res.data.code == 0) {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
      wx.hideNavigationBarLoading();
      wx.hideLoading();
    })
  },

  //我要购买列表
  getBuy() {
    let that = this
    wx.request({
      url: app.baseURL + '/Item/getCateList?token=' + wx.getStorageSync('token'),
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            buyList: res.data.data.list
          })
        }
      }
    })
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