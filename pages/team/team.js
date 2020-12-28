// pages/sales/team/team.js
const app = getApp();
// import { team } from '/config/https.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: '', // 所有数据
    list: [], // 列表
    page: 0,
    pagesize: 12,
    noMore: false,
    isNone: false,
    //为空提示
    emptyTip: {
      font: "还没有队友哦，快去邀请吧~",
      imgUrl: "../../../../assets/img/yaoqinren_empty.png"
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getData();
  },

  // 获取数据
  getData(){
    app.loading();
    team({
      token: wx.getStorageSync('userId'),
      page: ++this.data.page,
      pagesize: this.data.pagesize
    }).then(res =>{
      wx.hideLoading();
      if(res.code == 1){
        this.setData({
          data: res.data
        })
        if(res.data.list.length > 0){
          this.setData({
            list: [...this.data.list,...res.data.list],
            noMore: Number(res.data.list.length) < Number(this.data.pagesize) ? true : false
          })
        }else{
          this.setData({
            noMore: true
          })
        }

        if(this.data.list.length > 0){
          this.setData({
            isNone: false
          })
          this.setData({
            isNone: false
          })
        }else{
          this.setData({
            isNone: true
          })
        }
      }else{
        this.setData({
          isNone: true
        })
        app.$tip(res.msg)
      }
    })
  },

  // 去二级
  toDetail(e){
    wx.navigateTo({
      url: '../teamTwo/teamTwo?id='+ e.currentTarget.dataset.id,
    })
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
      this.getData();
    }
  },
})