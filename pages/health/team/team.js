// pages/myteam/index.js
const app = getApp()
const https = require('../../../config/https')
Page({
  data: {
    hasLogin: true, //判断有无登录
    currentIndex: 0,
    count: "0",
    twoCount: "0",
    threeCount: "0",
    isNone: false,
    level: "",
    list: [],
    second_id: '', //下级id
    page: 1,
    pagesize: 10
  },
  see(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../teamNext/teamNext?id=${id}`
    })
  },
  tab: function (e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    this.setData({
      currentIndex: index,
      type,
      page: 1,
      isNone: false,
      list: []
    })
    this.init(type)
  },
  onLoad: function (options) {
    this.init(1)
  },
  init(level) {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    https.myTeam({
      token: wx.getStorageSync('token'),
      // token: 'b0920589-e08b-473d-b26b-b35b64fe2f53',
      distributor: level,
      page: this.data.page,
      pagesize: this.data.pagesize
    }).then(res => {
      console.log(res)
      if (res.code == 1) {
        let temp = res.data.list
        let list = this.data.list
        list = [...list, ...temp]
        that.setData({
          list,
          isNone: !temp.length,
          count: res.data.count.count1,
          twoCount: res.data.count.count2,
          threeCount: res.data.count.count3,
        })
      }
      wx.hideLoading()
    })
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
      this.setData({
        hasLogin: false
      })
      wx.redirectTo({
        url: '../logintwo/index',
      })
      return
    }
    let that = this
    wx.request({
      url: app.baseURL + '/Mycenter/userInfo?token=' + wx.getStorageSync('token'),
      success(res) {
        that.setData({
          level: res.data.data.level
        })
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
    if (!this.data.isNone) {
      this.setData({
        page: this.data.page + 1
      })
      this.init(this.data.type)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})