// pages/notice/notice.js
const app = getApp();
var formatTime = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyTip: {
      font: "暂无头条信息",
      imgUrl: "https://jxoymr.0791jr.com/WeChat/images/empty-info.png"
    },
    newsList:[],
    loadmore:true,
    pagesize: 6,
    page:1,
    laoding: true,
    nomore: false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取新闻列表
    wx.request({
      url: app.baseURL + '/Article/article_list&page=1&pagesize=' + this.data.pagesize,
      success: (res) => {
        let newsList = res.data.data.list;
        //将时间戳转换成日期
        newsList.forEach((item) => item.createtime = formatTime.formatTime(item.createtime * 1000, 'hms'));
        this.setData({
          newsList: newsList,
          laoding: false
        });
        //判断是否已经加载到最底部
        this.isNoMore(newsList.length);
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /* 每次请求完数据：
  *     1.判断是否已经加载到最后一页，最后一页，显示没有更多提示
  *     2.关闭加载中的图标  
  */
  isNoMore(n) {
    this.setData({
      nomore: n < this.data.pagesize,
      loading: false
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      newsList: []
    });
    //用户下拉刷新数据
    wx.request({
      url: app.baseURL + '/Article/article_list&page=1&pagesize=' + this.data.pagesize,
      success: (res) => {
        console.log(res)
        let newsList = res.data.data.list;
        //将时间戳转换成日期
        newsList.forEach((item) => {
          item.createtime = formatTime.formatTime(item.createtime * 1000, 'hms');
        });
        this.setData({ newsList: newsList });
        //判断是否已经加载到最底部
        this.isNoMore(newsList.length);
        wx.stopPullDownRefresh();
      }
    });
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom(){
    if (!this.data.nomore) {
      this.setData({
        loading: true,
        page: this.data.page + 1
      });
      //用户下拉刷新数据
      wx.request({
        url: app.baseURL + '/Article/article_list&page='+ this.data.page + '&pagesize=' + this.data.pagesize,
        success: (res) => {
          let newsList = res.data.data.list;
          //将时间戳转换成日期
          newsList.forEach((item) => { item.createtime = formatTime.formatTime(item.createtime * 1000, 'hms')});
          this.setData({ newsList: [...this.data.newsList, ...newsList] });
          //判断是否已经加载到最底部
          this.isNoMore(newsList.length);
        }
      });
    }  
  }
})