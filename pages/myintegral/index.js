// pages/integral/index.js
const app = getApp()
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: "",
    today: "", //每日积分日期
    month: "", //每月积分日期
    dayInter:"",//日积分
    momthInter:"" //月积分
  },
  // 到积分明细
  toIntergal() {
    wx.navigateTo({
      url: '../myinterdetail/index',
    })
  },
  toCash() {
    wx.navigateTo({
      url: '../cash/index',
    })
  },
  // 选择日期
  selectDay(e) {
    console.log(e)
    this.setData({
      today: e.detail.value
    })
    this.getDayIntergral(1)
  },
  selectMonth(e) {
    this.setData({
      month: e.detail.value
    })
    this.getMomthIntergral(2)
  },


  getDayIntergral(dayType){
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL +'/distribution/integral_statistics',
      data: {
        token: wx.getStorageSync('token'),
        type: dayType,
        day:that.data.today
      },
      success(res){
        if(res.data.code == 1){
          that.setData({
            dayInter:res.data.data.data
            
          })
        }
        wx.hideLoading()
      }
    })
  },

  getMomthIntergral(monthType){
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/distribution/integral_statistics',
      data: {
        token: wx.getStorageSync('token'),
        type: monthType,
        month: that.data.month
      },
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            momthInter: res.data.data.data
          })
        }
        wx.hideLoading()
      }
    })
  },

  init() {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/distribution/center?token=' + wx.getStorageSync('token'),
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            info: res.data.data.info
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
      today: forMatDay,
      month: month
    })
    return
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let day = new Date(),
      forMatDay = utils.formatTime(day, 'hms'),
      month = forMatDay.split('-')[0] + '-' + forMatDay.split('-')[1]
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL +'/distribution/integral_statistics',
      data:{
        token: wx.getStorageSync('token'),
        type:'0',
        day: forMatDay,
        month: month
      },
      success(res){
        if(res.data.code == 1){
          that.setData({
            dayInter: res.data.data.data.day,
            momthInter: res.data.data.data.month
          })
        }
        wx.hideLoading()
      }
    })
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
    this.init()
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