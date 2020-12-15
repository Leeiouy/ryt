// pages/health/proxy/proxy.js
const app = getApp();
const https = require('../../../config/https')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviterMobile: ''
  },

  showPicker() {
    this.setData({
      isShowPicker: true,
      temp: this.data.levelShow[0],
      tempIndex: 0
    })
  },

  
  onChange(e) {
    let level = e.detail.value
    let index = e.detail.index
    console.log(e.detail)
    this.setData({
      temp: level,
      tempIndex: index
    })
  },

  cancel() {
    this.setData({
      isShowPicker: false
    })
  },

  ok() {
    let index = this.data.tempIndex
    let level = this.data.levelList[index].key
    this.setData({
      levelContent: this.data.temp,
      level
    })
    this.cancel()
  },

  retry () {
    this.setData({
      status: -1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options){
      this.setData({
        status: options.status,
        proxyBg: options.proxyBg
      })
    }
    if(options.scene){
      this.setData({
        inviterMobile: options.scene
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
    if (!wx.getStorageSync('token')) {
      wx.showModal({
        title: '温馨提示',
        content: '您还未登录,是否去登录?',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../logintwo/index?type=3',
            })
          }
          if (res.cancel) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    }else{
      let that = this;
      wx.request({
        url: app.baseURL + 'Mycenter/userInfo?token=' + wx.getStorageSync('token'),
        success(ress){
          if(ress.data.code == 1){
            if(ress.data.data.distributor < 1){
              https.healthProxyStatus({
                token: wx.getStorageSync('token')
              }).then(res => {
                if (res.code == 1) {
                  let levels = res.data[1]
                  wx.setStorageSync('levelList', levels)
                  let levelList = levels;
                  let level = levelList[0].key
                  let levelContent = levelList[0].value
                  let levelShow = []
                  levelList.forEach(item => {
                    levelShow.push(item.value)
                  })
                  that.setData({
                    levelList,
                    levelShow,
                    level,
                    levelContent
                  })
                  that.setData({
                    status: res.data[0].status,
                    // status: that.data.status >= 0 ? that.data.status : -1,
                    proxyBg: res.data[2]
                  })

                  console.log(that.data.status)
                }
              })
            }else{
              wx.showModal({
                title: '温馨提示',
                showCancel: false,
                content: '您已经是大健康会员了~',
                confirmText: '我知道了',
                success: (data) => {
                  if (data.confirm) {
                    wx.switchTab({
                      url: '/pages/my/index',
                    })
                  }
                }
              })
            }
          }
        }
      })
    }
  },


  myInputName (e) {
    let name = e.detail.value
    this.setData({
      name
    })
  },

  myInputNum (e) {
    let mobile = e.detail.value
    this.setData({
      mobile
    })
  },

  myInputCode (e) {
    let inviterMobile = e.detail.value
    this.setData({
      inviterMobile
    })
  },

  submit () {
    // let name = this.data.name
    // let mobile = this.data.mobile
    let inviterMobile = this.data.inviterMobile
    let token = wx.getStorageSync('token')
    if (!inviterMobile) {
      wx.showToast({
        title: '请完善申请信息！',
        icon: 'none'
      })
      return
    }
    https.healthProxy({
      token: wx.getStorageSync('token'),
      // name,
      // mobile,
      inviter_mobile: inviterMobile,
      rank: this.data.level
    }).then(res => {
      if (res.code == 1) {
        wx.showToast({
          title: '提交成功!',
          icon: 'none'
        })
        setTimeout(res => {
          wx.navigateBack({
            delta: 1,
          })
        }, 800)
      } else {
        let msg = res.msg
        wx.showToast({
          title: msg,
          icon: 'none'
        })
      }
      console.log(res)
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