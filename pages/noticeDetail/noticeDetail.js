// pages/noticeDetail/noticeDetail.js

const app = getApp(); //创建app实例
var WxParse = require('../../wxParse/wxParse.js'); //引入wxParse文件
var formatTime = require("../../utils/util.js"); //引入脚手架中的时间戳转换函数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取新闻id
    let news_id = options.news_id;
    //请求新闻的数据
    wx.request({
      url: app.baseURL + '/Article/article_details&article_id=' + news_id+'&token='+wx.getStorageSync('token'),
      success: (res) => {
        console.log(res)
        if (res.statusCode == 200) {
          let news = res.data.data.info, //返回的总信息
            content = news.content; //返回的详情
          //将时间戳转换成日期    
          news.createtime = formatTime.formatTime(news.createtime * 1000, 'hms'); 
          //解析html纯文本
          WxParse.wxParse('newsinfo', 'html', content, this, 5);
          //赋值
          this.setData({
            news: news
          });
        }  
      }
    });
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