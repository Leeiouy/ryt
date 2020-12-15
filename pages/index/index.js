const app = getApp();
var utils = require("../../utils/util.js");
import { seckill } from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    stock_alarm: null,
    tabheight: 0,  //状态栏高度
    hasLogin: true, //判断有无登陆
    level: "", //用户等级
    banner: '', //轮播图
    titles: "", //日悦头条
    isTop: false, // 文字滚动的状态，false初始位置，true顶部位置
    nav: "",
    limitedGoods: "", //限时秒杀商品
    todayGoods: "", //今日团品商品
    miaoshaStatus: 0, // 0距开始 1距结束 2已结束
    startTime: "", //开始时间
    endTime: "", //结束时间
    hour: "", //剩余时
    minute: "", //剩余分
    second: "", //剩余秒
    timmer: null,
    allStatus: 0,
    marginBottom:"",  //iphonex
    oferItem: []      //长期团品
  },
  // 轮播图跳转
  clickToDetail(e) {
    let skipUrl = e.currentTarget.dataset.url
    let type = 'navigate'
    switch(skipUrl){
      case '/pages/my/index': 
      case '/pages/index/index':
      case '/pages/subcase/index':
      case '/pages/address/address':
      case '/pages/shoudan/index':
        type = 'switchTab'
      break;
    }
    console.log(skipUrl)
    type == 'switchTab' && wx.switchTab({ url: skipUrl })
    type == 'navigate' && wx.navigateTo({ url: skipUrl })
  },
  // 分类导航跳转
  goNav(e) {
    if (e.currentTarget.dataset.name == "往期商品") {
      wx.navigateTo({
        url: '../oldgoods/index',
      })
    } else if (e.currentTarget.dataset.name == "每日之星") {
      wx.navigateTo({
        url: '../dailystar/index',
      })
    } else if (e.currentTarget.dataset.name == "今日团品") {
      const query = wx.createSelectorQuery()
      query.select('#todayGroup').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res) {
        if (res[0] && res[1]) {
          wx.pageScrollTo({
            scrollTop: res[1].scrollTop + res[0].top,
          })
        }
      })
    } else if (e.currentTarget.dataset.name == "甄选优品"){
      wx.navigateTo({
        url: '/pages/oferList/oferList',
      })
    } else if (e.currentTarget.dataset.name.indexOf('大健康') != -1) {
      if (wx.getStorageSync('token')) {
        wx.navigateTo({
          url: '/pages/health/index/index',
        })
      } else {
        wx.showToast({
          title: '尚未登录，请先登录！',
          icon: 'none'
        })
        setTimeout(res => {
          wx.navigateTo({
            url: '/pages/logintwo/index',
          })
        }, 800)
      }
    }
  },

  //文字滚动
  scroll() {
    let list = this.data.titles; //获取数据列表
    
    clearInterval(this.Interval);
    //3s滚动一次
    this.Interval = setInterval(() => {
      this.setData({
        isTop: true
      });
      //tanslation = 300ms，故数据变动的间隔也是300ms
      setTimeout(() => {
        let list = this.data.titles
        list.push(list.shift());
        this.setData({
          'titles': list,
          isTop: false
        });
      }, 300);
    }, 3000);
  },

  // 初始化首页数据
  initData(cb) {
    let that = this
    wx.showLoading({
      title: '加载中...'
    });
    wx.request({
      url: app.baseURL + '/index/index?token=' + wx.getStorageSync('token'),
      success: (res) => {
        console.log(res)
        let data = res.data
        if (data.code == 1) {
          let stock_alarm = data.data.stock_alarm
          if (stock_alarm){  //即将售完提示线
            app.globalData.stock_alarm = stock_alarm
            this.setData({ stock_alarm })
          }
          
          clearInterval(this.timer);
          if(data.data.limited_time_item.length > 0){
            this.timer = setInterval(()=>{
              data.data.limited_time_item.forEach(item => {
                let now = Math.round(new Date() / 1000);
                // 未开始
                if (Number(item.start_time) > Number(now)) {
                  item.will = 1;
                  item.timeText = seckill(Number(item.start_time) - Number(now));
                }
                // 已开始
                if (Number(item.start_time) < Number(now) && Number(item.end_time) >= Number(now)) {
                  item.start = 1;
                  item.timeText = seckill(Number(item.end_time) - Number(now));
                }
                // 已结束
                if (Number(item.end_time) < Number(now)) {
                  item.end = 1;
                  item.start = 0;
                  item.will = 0;
                }
                
              })
              this.setData({
                limitedGoods: data.data.limited_time_item,
                
              })
            },1000)
          }
          that.scroll() //头条滚动
          that.setData({
            banner: data.data.banner,
            titles: data.data.new_list,
            todayGoods: data.data.item_list,
            djkGoods: data.data.djk_item_list,
            nav: data.data.guidePage,
            oferItem: data.data.limited_time_item
          });
          typeof cb == 'function' && cb();
          wx.hideLoading();
        }
      }
    })
  },

  //加载默认图片
  errorFunction: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var img = 'limitedGoods[' + index + '].image'
    this.setData({
      [img]: '/pages/images/goodmo.jpg'
    })
  },
  longTerm(){   //长期团品
    // wx.request({
    //   url: app.baseURL + '/index/often_goods',
    //   data: {
    //     token: wx.getStorageSync('token'),
    //     type: 1,
    //     page: 1,
    //     pagesize: 6
    //   },
    //   success: (res) => {
    //     if (res.data.code != 0) {
    //       this.setData({ oferItem: res.data.data.often_item })
    //     }
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({ tabheight: res.statusBarHeight })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!wx.getStorageSync('token')) {
      this.setData({
        hasLogin: false
      })
    }
    let that = this
    // wx.request({
    //   url: app.baseURL + '/Index/guidePages',
    //   success(res) {
    //     that.setData({
    //       nav: res.data.data.guidePage
    //     })
    //   }
    // })
    wx.request({
      url: app.baseURL + '/Mycenter/userInfo?token=' + (wx.getStorageSync('token') ? wx.getStorageSync('token') : ''),
      success: (res) => {
        if (res.data.code == 1) {
          let level = res.data.data.level
          let distributor = res.data.data.distributor

          this.setData({
            level: level,
            distributor: distributor
          })
          app.globalData.level = level;
        } else if (res.data.code == 0 && wx.getStorageSync('token')) {
          wx.clearStorageSync()
          wx.showToast({
            title: '请重新登陆',
            icon: "none"
          })
          setTimeout(function() {
            wx.reLaunch({
              url: '../logintwo/index',
            })
          }, 1200)
        }
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        if (res.model.search('iPhone X') != -1) {
          that.setData({
            marginBottom: '200rpx'
          })
        }
      },
    })

    this.initData()
    this.longTerm()
  },
  onHide: function(){
  },
  onUnload: function(){
    clearInterval();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.initData(wx.stopPullDownRefresh())
  },

  //转发
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
})