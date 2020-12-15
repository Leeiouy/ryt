// pages/myachieverank/index.js
const app = getApp()
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "1",
    month: "",
    selectArray: [{
        "id": "1",
        "text": "分销商"
      },
      {
        "id": "2",
        "text": "直属"
      },
      {
        "id": "3",
        "text": "联创"
      },
    ],
    page: "1",
    pagesize: "10",
    rankList: "", //业绩排行
    isNone: false //为空判断
  },

  tab(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      type: type
    })
    this.getRank(type)
  },
  onMyEvent(e) {
    let type = this.data.type
    console.log(e)
    this.setData({
      level: e.detail.val
    })
    this.getRank(type)
  },
  //获取业绩排行
  getRank(type) {
    let that = this
    let day = new Date(),
      forMatDay = utils.formatTime(day, 'hms'),
      month = forMatDay.split('-')[0] + '-' + forMatDay.split('-')[1]
    that.setData({
      month: month
    })
    let data = {
      token: wx.getStorageSync('token'),
      type: type,
      month: month,
      level: !that.data.level ? '1' : that.data.level,
      page: that.data.page,
      pagesize: that.data.pagesize
    }
    console.log(data)
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/distribution/sales_rank',
      data: data,
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            rankList: res.data.data.list,
            isNone: !res.data.data.list.length
          })
        }
        wx.hideLoading()
      }
    })
  },
  getDay() {
    let day = new Date(),
      forMatDay = utils.formatTime(day, 'hms'),
      month = forMatDay.split('-')[0] + '-' + forMatDay.split('-')[1]
    this.setData({
      month: month
    })
    return
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.getRank(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getDay()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})