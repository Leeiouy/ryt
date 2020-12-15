// pages/health/index/index.js
const app = getApp()
const https = require('../../../config/https.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    noMore: false,
    todayGoods: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.request({
    //   url: app.baseURL + '/index/index?token=' + wx.getStorageSync('token'),
    //   success: res => {
    //     console.log(res)
    //     let todayGoods = res.data.data.item_list
    //     this.setData({
    //       todayGoods
    //     })
    //   }
    // })
    this.getData();
  },

  // 获取数据
  getData(){
    https.healthList({
      token: wx.getStorageSync('token'),
      page: this.data.page,
      pagesize: 10
    }).then(res => {
      console.log(res)
      this.setData({
        noMore: res.data.item.length >= 10 ? false : true
      })
      let todayGoods = res.data.item
      let banner = res.data.hot_banner
      let isPass = res.data.is_message
      let isBigHealth = res.data.is_bigHealth
      if (isPass == 1) {
        wx.showModal({
          showCancel: false,
          confirmText: '确定',
          title: '温馨提示',
          content: '您已通过大健康代理审核！',
          success: res => {
            
          }
        })
      }
      this.setData({
        banner: banner,
        todayGoods: [...this.data.todayGoods,...todayGoods],
        isPass: isPass,
        isBigHealth: isBigHealth
      })
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
    if(wx.getStorageSync('token')){
      this.setData({
        hasLogin: true
      })
    }else{
      this.setData({
        hasLogin: false
      })
    }
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
    if(!this.data.noMore){
      this.data.page++;
      this.getData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})