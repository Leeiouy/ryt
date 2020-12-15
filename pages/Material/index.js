// pages/Material/index.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    imgs: "",
    paddingBottm: "",//iphonex
    images:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let content;
    if (wx.getStorageSync('metaril')){
      content = JSON.parse(wx.getStorageSync('metaril'));
      wx.removeStorageSync('metaril')
      let img = content.shareImg.split(',')
      this.setData({
        content: content,
        images: img
      })
    }
   
  },
  // 复制文本
  copyText() {
    wx.setClipboardData({
      data: this.data.content.shareContent,
      success(res) {
        console.log(res)
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: '复制成功',
            })
          }
        })
      }
    })
  },

  //分享功能复制文案，保存图片到相册，成功后开启分享浮层
  downLoad: function (e) {
    var that = this;
    var pics = that.data.images;
    // var sharetext = e.currentTarget.dataset.text;
    // that.setData({
    //   sharetext: sharetext
    // })
    wx.showLoading({
      title: '图片下载中..',
    })
    var all_n = pics.length;
  
    that.dow_temp(0);
    
  
  },

  //下载单个内容

  dow_temp: function(i, callback) {
    var that = this;
    var data = that.data.images;
    var all_n = data.length;
    if (i < all_n) {
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success() {
          // 用户已经同意小程序使用相册的授权
          const downloadTask = wx.downloadFile({
            url: 'https://riyuetaoguoji.com' +data[i],
            // url: data[i],
            success: function(res) {
              var temp = res.tempFilePath;
              console.info("临时路径", temp)
              wx.saveImageToPhotosAlbum({
                filePath: temp,
                success: function() {
                  console.info('第', (i + 1), '张保存成功');
                  that.dow_temp(i + 1);
                  //开启分享浮层
                  if (i == all_n - 1) {
                    wx.showToast({
                      title: '已下载完成',
                    })
                  }
                },
                fail: function() {
                  console.info('第', (i + 1), '张保存失败');
                  that.dow_temp(i);
               }
              })
            },
            fail: function(res) {
              wx.showToast({
                icon: 'none',
                title: '获取图片临时路径失败',
              })
            }
          })
        },
        fail: function() {
          wx.showToast({
            icon: 'none',
            title: '获取授权失败',
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    let that = this
    wx.getSystemInfo({
      success: function (res) {
        if (res.model.search('iPhone X') != -1) {
          that.setData({
            paddingBottm: '40' + 'rpx',
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})