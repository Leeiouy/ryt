// pages/waitdetail/index.js
const app = getApp()
const https = require('../../config/https')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: "",
    totalNum: 0,
    totalPrice: "",
    status: '' //判断从哪个页面过来
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    that.setData({
      status: options.status,
      type: options.type
    })
    if (this.data.type == 1) {
      wx.request({
        url: app.baseURL + '/order/order_delivered',
        data: {
          token: wx.getStorageSync('token'),
          order_submit_id: options.id
        },
        success(res) {
          console.log(res)
          if (res.data.code == 1) {
            let totalNum = 0,
              totalPrice = 0,
              totalfreight = 0
            let orderList = res.data.data.list
            orderList.forEach(item => {
              if (item.order_status != 0) {
                item.sub.forEach(goods => {
                  totalNum += Number(goods.total_num)
                  totalPrice += Number(goods.price) * Number(goods.total_num)
                  totalfreight += Number(goods.freight);
                  that.setData({
                    totalNum: totalNum,
                    totalPrice: Number(totalPrice),
                    totalfreight: Number(totalfreight)
                  })
                })
              }
            })
            that.setData({
              orderList: res.data.data.list
            })
          }
        }
      })
    } else {
      https.healthGoodsDetail({
        token: wx.getStorageSync('token'),
        order_submit_id: options.id
      }).then(res => {
        console.log(res)
        if (res.code == 1) {
          let totalNum = 0,
            totalPrice = 0,
            totalfreight = 0
          let orderList = res.data.list
          console.log(orderList)
          orderList.forEach(item => {
            if (item.order_status != 0) {
              item.sub.forEach(goods => {
                totalNum += Number(goods.total_num)
                totalPrice += Number(goods.price) * Number(goods.total_num)
                totalfreight += Number(goods.freight);
                that.setData({
                  totalNum: totalNum,
                  totalPrice: Number(totalPrice),
                  totalfreight: Number(totalfreight)
                })
              })
            }
          })
          that.setData({
            orderList
          })
        }
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
})