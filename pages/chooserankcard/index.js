// pages/chooserankcard/index.js
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
  tomanage(){
    wx.navigateTo({
      url: '../managecard/index',
    })
  },

  choseBank(e){
    let index = e.currentTarget.dataset.index
    let bankCardList= this.data.bankCardList
    console.log(bankCardList[index])
    bankCardList[index].status = !bankCardList[index].status
    this.setData({
      bankCardList:bankCardList
    })
    console.log(getCurrentPages())
    //获取页面栈
    let pages = getCurrentPages();
    //获取上一个页面
    let prev = pages[pages.length - 2];
    //调用上一个页面的setData方法，从而达到naviagtreBack返回传参的效果
    //简单粗暴
    prev.setData({
      bankId: e.currentTarget.dataset.bankid, //选中的地址数据
      bankName: e.currentTarget.dataset.name,
      or: e.currentTarget.dataset.or
    });
    wx.navigateBack();
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
    wx.request({
      url: app.baseURL + '/bank/user_bank_list',
      data: {
        token: wx.getStorageSync('token'),
        page: "1",
        pagesize: "15"
      },
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          let bankList = res.data.data.list
          bankList.forEach(item =>{
            item.status = false
            that.setData({
              bankCardList: bankList,
            })
          })
          that.setData({
            isNone:!bankList.length
          })
        }
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.model.search('iPhone X') != -1) {
          that.setData({
            marginBottom: '40' + 'rpx'
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