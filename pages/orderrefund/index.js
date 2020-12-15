// pages/orderrefund/index.js
const app = getApp()
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:"",
    address:"",
    totalNum:"" ,//商品数量
    placeOrdertime:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let refundid = options.id
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL +'/order/getAfterSaleDetail',
      data:{
        token:wx.getStorageSync('token'),
        refund_id:refundid
      },
      success(res){
        console.log(res)
        if(res.data.code == 1){
          let ordertime = utils.formatTime(res.data.data.createtime * 1000, 'hms')
          res.data.data.sub.forEach(item =>{
            that.setData({
              totalNum: item.total_num
            })
          })
          that.setData({
            data:res.data.data,
            placeOrdertime:ordertime
          })
          that.getAddress(res.data.data.order_id)
        }
        wx.hideLoading()
      }
    })
  },

  getAddress(order_id){
    let that = this
    wx.request({
      url: app.baseURL +'/order/getOrderDetail',
      data:{
        token:wx.getStorageSync('token'),
        order_id: order_id
      },
      success(res){
        if(res.data.code == 1){
          that.setData({
            address:res.data.data.address
          })
        }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})