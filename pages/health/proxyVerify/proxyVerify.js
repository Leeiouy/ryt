// pages/health/proxyVerify/proxyVerify.js
const https = require('../../../config/https')
const { get } = require('../../../config/api')
const { formatTime } = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: app.globalData.imgBaseUrl,
    currentIndex: 0,
    page: 1,
    pagesize: 10,
    list: [],
    hasMore: true
  },

  mySwitch (e) {
    let currentIndex = e.currentTarget.dataset.index
    this.setData({
      currentIndex,
      hasMore: true,
      list: []
    })
    this.getList()
  },

  toRefuse (e) {
    let uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: '../refuse/refuse?uid=' + uid,
    })
  },

  refuse (e) {
    let uid = e.currentTarget.dataset.uid
    https.proxyCheck({
      token: wx.getStorageSync('token'),
      uid,
      decision: 20,
    }).then(res => {
      console.log(res)
      if (res.code == 1) {
        wx.showToast({
          title: '已拒绝',
        })
        setTimeout(res => {
          this.setData({
            hasMore: true,
            list: [],
          })
          this.getList()
        }, 500) 
      }
    })
  },

  agree (e) {
    let uid = e.currentTarget.dataset.uid
    https.proxyCheck({
      token: wx.getStorageSync('token'),
      uid,
      decision: 10,
    }).then(res => {
      console.log(res)
      if (res.code == 1) {
        wx.showToast({
          title: '审核成功',
        })
        setTimeout(res => {
          this.setData({
            hasMore: true,
            list: [],
          })
          this.getList()
        }, 500) 
      }
    })
  },

  delete (e) {
    https.proxyCheckDel({
      token: wx.getStorageSync('token'),
      // token: 'b0920589-e08b-473d-b26b-b35b64fe2f53',
      id: e.currentTarget.dataset.uid
    }).then(res => {
      if (res.code == 1) {
        wx.showToast({
          title: '删除成功',
        })
        setTimeout(res => {
          this.setData({
            hasMore: true,
            list: [],
          })
          this.getList()
        }, 500) 
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  getList () {
    https.proxyCheckList({
      token: wx.getStorageSync('token'),
      // token: 'b0920589-e08b-473d-b26b-b35b64fe2f53',
      page: this.data.page,
      pagesize: this.data.pagesize,
      status: this.data.currentIndex
    }).then(res => {
      console.log(res)
      if (res.code == 1) {
        let temp = res.data
        res.data.forEach((item) =>{
          item.createtime = formatTime(item.createtime * 1000)
          if(item.updatetime){
            item.updatetime = formatTime(item.updatetime * 1000)
          }
        })
        let list = this.data.list
        list = [...list, ...temp]
        if (temp.length < this.data.pagesize) {
          this.setData({
            hasMore: false
          })
        }
        this.setData({
          list
        })
      }
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
    if(this.data.hasMore) {
      this.setData({
        page: this.data.page + 1,
      })
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})