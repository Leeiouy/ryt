const app = getApp();

Page({

  data: {
    list: [],
    page: 1,
    pagesize: 6,
    loading: true,
    stock_alarm: null,
    hot_banner: '', // 海报
    hasLogin: true
  },
  fetch(){
    wx.request({
      url: app.baseURL + '/index/often_goods',
      data: {
        token: wx.getStorageSync('token'),
        page: this.data.page,
        pagesize: this.data.pagesize
      },
      success: res => {
        let list = res.data.data.often_item
        this.setData({ 
          list: [...this.data.list, ...list],
          page: this.data.page + 1,
          hot_banner: res.data.data.hot_banner
        })
        console.log(list.length, this.data.pagesize)
        if(list.length < this.data.pagesize ){
          this.setData({ loading: false })
        }
      }
    })
  },
  onLoad: function (options) {
    this.setData({ stock_alarm: app.globalData.stock_alarm })
    this.fetch()
  },
  onShow: function () {
    if (!wx.getStorageSync('token')) {
      this.setData({
        hasLogin: false
      })
    }
  },
  onReachBottom: function () {
    if(this.data.loading){
      this.fetch()
    }
  }
})