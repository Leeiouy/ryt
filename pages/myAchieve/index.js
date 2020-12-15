// pages/myAchieve/index.js
const app = getApp()
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: "",
    today: "", //每日业绩日期
    month: "", //每月业绩日期
    dayAch: "", //每日业绩
    monthAch: "", //每月业绩
  },
  toRank() {
    wx.navigateTo({
      url: '',
    })
  },

  // 选择日期
  selectDay(e) {
    this.setData({
      today: e.detail.value
    })
    this.getDayAchieve(e.detail.value)
  },
  // 每月
  selectMonth(e) {
    this.setData({
      month: e.detail.value
    })
    this.getMonthAchieve(e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //this.getDay()
  },
  getDay() {
    let day = new Date(),
      forMatDay = utils.formatTime(day, 'hms'),
      month = forMatDay.split('-')[0] + '-' + forMatDay.split('-')[1]
    this.setData({
      today: forMatDay,
      month: month
    })
    this.fetch()
    return
  },

  //获取默认当天业绩
  fetch(){
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/distribution/sales_statistics',
      data: {
        token: wx.getStorageSync('token'),
        type: '0',
        category: 1
      },
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            dayAch: res.data.data.data.day,
            monthAch: res.data.data.data.month
          })
        }
        wx.hideLoading()
      }
    })
  },

  //获取每日业绩
  getDayAchieve(day) {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/distribution/sales_statistics',
      data: {
        token: wx.getStorageSync('token'),
        type: '1',
        day: day,
        category: 1
      },
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            dayAch: res.data.data.data
          })
        }
        wx.hideLoading()
      }
    })
  },
  //获取每月业绩
  getMonthAchieve(month) {
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      type: '2',
      month: month,
      category: 1
    }
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/distribution/sales_statistics',
      data: data,
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            monthAch: res.data.data.data
          })
        }
        wx.hideLoading()
      }
    })
  },
  onShow: function() {
    let that = this
    that.getDay()
    wx.request({
      url: app.baseURL + '/distribution/my_sales?token=' + wx.getStorageSync('token') + '&category=1',
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            data: res.data.data.data
          })
        }
      }
    })
  }
})