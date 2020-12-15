// pages/mycollect/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectList: null, //收藏列表
    isNone: false
  },

  toDetail (e) {
    let type = e.currentTarget.dataset.type
    let goodId = e.currentTarget.dataset.id
    if (type == 4) {
      wx.navigateTo({
        url: '/pages/health/detail/detail?goods_id=' + goodId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/productdetail/index?goods_id=' + goodId,
      })
      
    }
  },

  //删除
  collectDel(e){
    let that = this
    let list = that.data.collectList
    let index = e.currentTarget.dataset.index
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL +'/collection/delCollect',
      data:{
        token:wx.getStorageSync('token'),
        type:"1",
        item_id:e.currentTarget.dataset.id
      },
      success(res){
        console.log(res)
        if(res.data.code == 1){
          list.splice(index , 1)
          that.setData({
            collectList:list,
            isNone:!list.length
          })
          wx.showToast({
            title: res.data.msg,
          })
        }else if(res.data.code == 0){
          wx.showToast({
            title: res.data.msg,
            icon:"none"
          })
        }
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
    wx.showLoading({
      title: '加载中',
    })
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.baseURL + '/collection/getCollectLists' ,
      data:{
        token:token,
        type:'1',
        page:"1",
        pagesize:'15'
      },
      success: (res) => {
        if (res.statusCode == 200) {
          console.log(res)
          this.setData({
            collectList: res.data.data.list,
            isNone: !res.data.data.list.length
          });
          wx.hideLoading();
        }
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