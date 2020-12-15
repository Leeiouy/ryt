// pages/orderaftersale/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin:true,  //判断有无登陆
    currentIndex: 0,
    orderList: "",
    isNone: false, //false隐藏为空提示， true显示为空提示
    emptyTip: {
      font: "您暂时还没有订单哦~",
      imgUrl: "/images/none-order.png"
    },
  },

  tab: function (e) {
    let index = e.currentTarget.dataset.index
    let status = e.currentTarget.dataset.status
    this.setData({
      currentIndex: index,
    })
    this.init(status)
  },

  toRefund(e){
    wx.navigateTo({
      url: '../orderrefund/index?id='+e.currentTarget.dataset.id,
    })
  },
  init(status) {
    let that = this
    let token = wx.getStorageSync('token')
    let data = {
      token: token,
      refund_status: status,
      page: "1",
      pagesize: "15"
    }
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/order/getAfterSaleLists',
      data: data,
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            orderList: res.data.data.list,
            isNone: !res.data.data.list.length,
          })
        } else if (res.data.code == 0){
          wx.showToast({
            title: res.data.msg,
            icon:"none"
          })
        }
        wx.hideLoading()
        return
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init('10')
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
    if(!wx.getStorageSync('token')){
      this.setData({
        hasLogin:false
      })
      wx.showToast({
        title: '请先登录',
        icon:"none",
      })
        wx.reLaunch({
          url: '../logintwo/index',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})