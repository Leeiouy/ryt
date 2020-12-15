// pages/orderDetail/orderDetail.js

//获取app实例
const app = getApp();
var utils = require("../../utils/util.js");

Page({
  data: {
    data: "",
    addTime: "", //下单时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
  },

  //初始化我的订单
  init() {
    wx.request({
      url: app.baseURL + '/order/getOrderDetail',
      data: {
        token: wx.getStorageSync('token'),
        order_id: this.options.orderid
      },
      success: (res) => {
        console.log(res)
        if (res.statusCode == 200) {
          this.updateData(res.data.data);
          this.setData({
            data: res.data.data
          })
          typeof cb == 'function' && cb();
        }
      }
    })
  },

  //更新数据函数
  updateData(data) {
    const addTime = utils.formatTime(data.createtime * 1000); 
    this.setData({
      addTime: addTime,
    })
  },
  // 取消订单
  del(e){
    let order_id = e.currentTarget.dataset.order_id;
    wx.showModal({
      title: '温馨提示',
      content: '是否取消订单？',
      confirmColor: "#f00",
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.baseURL + '/order/setCancelOrder',
            data: {
              token: wx.getStorageSync('token'),
              order_id: order_id
            },
            success(res) {
              if (res.data.code == 1) {
                wx.redirectTo({
                  url: "/pages/orderSuccess/index?title=操作成功&tip=您已成功取消订单"
                })
              }
            }
          })
        }
      }
    })
  },
  // 确认收货
  confirmReceipt(e) {
    let order_id = e.currentTarget.dataset.order_id;
    wx.showModal({
      title: '确认收到货了吗？',
      content: '为保障您的售后权益,请收到货确认无误后,再确认收货哦！',
      confirmText: "确认收货",
      confirmColor: "#f00",
      success: (res) => {
        if (res.confirm) {
          //加载中提示
          wx.showLoading({ title: '加载中' });
          wx.request({
            url: app.baseURL + '/order/confirm_receipt',
            data: {
              token: wx.getStorageSync('token'),
              order_id: order_id
            },
            success: (res) => {
              if (res.statusCode == 200) {
                if (res.data.code == 1) {
                  //收货成功
                  wx.hideLoading();
                  //前往结果页面
                  wx.redirectTo({ url: "/pages/orderSuccess/index?title=收货成功&tip=您已成功收货" });
                } else if (res.data.status == 2) {
                  //收货失败
                  wx.hideLoading();
                  wx.showToast({ title: '操作失败，请重试', icon: 'none' })
                }
              }
            },
            fail: (res) => {
              wx.hideLoading();
              wx.showToast({ title: '网络错误', icon: 'none' })
            }
          })
        }
      }
    })
  },


})