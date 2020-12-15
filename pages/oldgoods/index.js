// pages/oldgoods/index.js
const app = getApp();
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    now: "", //当天日期
    yers: "", //前一天日期
    before: "", //前天日期
    early: "", //更早日期
    todayGoods:"", //当日商品
    isNone:false,
    type:'1' , 
    page:"1",
    pagesize:"100",
    end_time:"", //下架时间
    extra_time:"", //延长时间
    status: 0, //未售罄
    day: "", //当前时间
    hasLogin: true
  },
  skip(e){
    let day = Math.round(new Date() / 1000)
    let end_time = e.currentTarget.dataset.time
    let end_day=utils.formatTime(end_time, 'hms')
    let extra_day = utils.formatTime(extra_day, 'hms')
    if ((Number(end_time) + Number(this.data.extra_time)) > day){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/productdetail/index?goods_id=${id}`
      })
    }else{
      // this.data.status = 1
      app.tips("该商品已停止出售")
    } 
  },
  tab: function(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index,
      type: e.currentTarget.dataset.type
    })
    this.initData()
  },
  initData() {
    let that = this
    wx.showLoading({
      title: '加载中...'
    });
    wx.request({
      url: app.baseURL + '/index/prophase_item',
      data: {
        token:wx.getStorageSync('token'),
        type: that.data.type,
        page: that.data.page,
        pagesize: that.data.pagesize,
      },
      success(res) {
        console.log(res)
        if(res.data.code == 1){
          that.setData({
            todayGoods: res.data.data.list,
            isNone: !res.data.data.list.length,
            extra_time:res.data.data.extra_time,
            day: Math.round(new Date() / 1000)
          })
        }
        typeof cb == 'function' && cb();
        wx.hideLoading();
      }
    })
  },

  getDay(t) {
    let day = new Date() - (24 * t) * 60 * 60 * 1000 ,
    forMatDay = utils.formatTime(day, 'hms'),
    today = forMatDay.split('-')[1] + '-' + forMatDay.split('-')[2]
    if (t == 1) {
      this.setData({
        now: today
      })
      return
    }
    if (t == 2) {
      this.setData({
        yers: today
      })
      return
    }
    if (t == 3) {
      this.setData({
        before: today
      })
      return
    }
    if (t == 4) {
      this.setData({
        early: today
      })
      return
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getDay(1)
    this.getDay(2)
    this.getDay(3)
    this.getDay(4)
    this.initData()
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
    if (!wx.getStorageSync('token')) {
      this.setData({
        hasLogin: false
      })
    }
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