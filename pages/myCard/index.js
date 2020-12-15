// pages/myCard/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankCardList:"",
    isNone: false,
    marginBottom: ''
  },
  tomanage() {
    wx.navigateTo({
      url: '../managecard/index',
    })
  },

  deleteCard(e){
    let that = this
    let bankList = this.data.bankCardList
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL +'/bank/delete_bank_card',
      data:{
        token:wx.getStorageSync('token'),
        bank_id:e.currentTarget.dataset.id
      },
      success(res){
        if(res.data.code == 1){
          wx.showToast({
            title: res.data.msg,
          })
        }
        bankList.splice(e.currentTarget.dataset.index,1)
        that.setData({
          bankCardList: bankList,
          isNone:!bankList.length
        })
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/bank/user_bank_list',
      data:{
        token:wx.getStorageSync('token'),
        page:"1",
        pagesize:"15"
      },
      success(res){
        console.log(res)
        if(res.data.code == 1){
          that.setData({
            bankCardList : res.data.data.list,
            isNone: !res.data.data.list.length,
          })
        }
        wx.hideLoading()
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.model.search('iPhone X') != -1) {
          that.setData({
            marginBottom: '40'+'rpx'
          })
        }
      },
    })
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