// pages/myteam/index.js
const app = getApp()
Page({
  data: {
    hasLogin:true,//判断有无登录
    currentIndex: 0,
    count:"0",
    twoCount:"0",
    threeCount:"0",
    isNone:false,
    level:"",
    list:[],
    second_id: '',  //下级id
  },
  see(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/myteam1/index?id=${id}`
    })
  },
  tab: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index,
    })
    this.init(e.currentTarget.dataset.type)
  },
  onLoad: function (options) {
    this.init(1)
  },
  init(level){
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL +'/distribution/team',
      data:{
        token:wx.getStorageSync('token'),
        level:level
      },
      success(res){
        if(res.data.code == 1){
          let list = res.data.data.list
          // list.forEach(item =>{
          //   if(item.level == 1){
          //    that.setData({
          //      count:list.length
          //    }) 
          //   }
          //   if (item.level == 2) {
          //     that.setData({
          //       twoCount: list.length
          //     })
          //   }
          //   if (item.level == 3) {
          //     that.setData({
          //       threeCount: list.length
          //     })
          //   }
          // })
          that.setData({
            list:res.data.data.list,
            isNone:!res.data.data.list.length,
            count: res.data.data.count.count1,
            twoCount: res.data.data.count.count2,
            threeCount: res.data.data.count.count3,
          })
        }
        wx.hideLoading()
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
    if(!wx.getStorageSync('token')){
      this.setData({
        hasLogin:false
      })
      wx.redirectTo({
        url: '../logintwo/index',
      })
      return
    }
    let that = this
    wx.request({
      url: app.baseURL +'/Mycenter/userInfo?token='+wx.getStorageSync('token'),
      success(res){
        that.setData({
          level: res.data.data.level
        })
      }
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