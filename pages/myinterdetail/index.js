// pages/myinterdetail/index.js
const app = getApp();
var utils = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:"",
    currentIndex: 0,
    type:"1",
    page:"1",
    pagesize:"20",
    start:"选择开始时间",
    end:"选择结束时间"
  },

  tab: function (e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    this.setData({
      currentIndex: index,
      type:type
    })
    this.init(type)
  },

  selectStart(e){
    this.setData({
      start:e.detail.value
    })
  },
  selectEnd(e){
    this.setData({
      end:e.detail.value
    })
  },
  search(){
    if (this.data.start == '选择开始时间' || this.data.start =='选择结束时间'){
      wx.showToast({
        title: '请选择时间',
        icon:"none"
      })
      return
    }
    if(this.data.type == 1){
      this.init(1)
    }else if(this.data.type == 2){
      this.init(2)
    }else{
      this.init(3)
    }
  },
  today(){  //获取现在的时间
    let time = (new Date()).getTime();
    time = utils.formatTime(time, 'hms')
    this.setData({
      start: time,
      end: time
    })
  },
  init(type){
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.baseURL +'/distribution/detailedCommission',
      data:{
        token:wx.getStorageSync('token'),
        type:type,
        page:that.data.page,
        pagesize:that.data.pagesize,
        start_time: that.data.start == '选择开始时间' ? '':that.data.start ,
        end_time: that.data.end == "选择结束时间" ? '' : that.data.end
      },
      success(res){
        console.log(res)
        if(res.data.code == 1){
          let list = res.data.data.list
          list.forEach(item=>{
            item.createtime=utils.formatTime(item.createtime * 1000, 'hms')
          })
          if(!list.length){
            setTimeout(function () {
              wx.showToast({
                title: '暂时没有积分明细',
                icon: "none",
                duration: 3000
              },3000)
            })
          }
          that.setData({
            list: list
          })
        }
        wx.hideLoading()
      }
    })
  },
  onLoad: function (options) {
    this.today()
    this.init(1)
  }
})