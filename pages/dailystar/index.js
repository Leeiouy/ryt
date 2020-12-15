const app = getApp();
Page({
  data: {
    type: "1",
    page: "1",
    pagesize: "10",
    tFirst: "", //今天第一名
    tSecond: "", //今天第二
    tThird: "", //今天第三
    yFirst: "",//昨天第一名
    ySecond: "",//昨天第二名
    yThird: "",//昨天第三名
    list: [], //排行
    isNone: false
  },
  tabToday(e) {
    let that = this
    let type = e.currentTarget.dataset.type
    that.setData({
      type: type
    })
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/index/daily_star',
      data: {
        token: wx.getStorageSync('token'),
        type: type,
        page: that.data.page,
        pagesize: that.data.pagesize
      },
      success(res) {
        if (res.data.code == 1) {
          let list = res.data.data.list
          if (list.length > 2) {
            that.setData({
              tFirst: list[0],
              tSecond: list[1],
              tThird: list[2]
            })
          }
          if (list.length > 1) {
            that.setData({
              tFirst: list[0],
              tSecond: list[1],
            })
          }
          if (list.length > 0) {
            that.setData({
              tFirst: list[0],
            })
          }
          // list.splice(0, 3)
          that.setData({
            list: list
          })
        }
        wx.hideLoading()
      }
    })
  },
  tabYers(e) {
    let that = this
    let type = e.currentTarget.dataset.type
    that.setData({
      type: type
    })
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/index/daily_star',
      data: {
        token: wx.getStorageSync('token'),
        type: type,
        page: that.data.page,
        pagesize: that.data.pagesize
      },
      success(res) {
        if (res.data.code == 1) {
          let list = res.data.data.list
          if (list.length > 2) {
            that.setData({
              tFirst: list[0],
              tSecond: list[1],
              tThird: list[2]
            })
          }
          if (list.length > 1) {
            that.setData({
              tFirst: list[0],
              tSecond: list[1],
            })
          }
          if (list.length > 0) {
            that.setData({
              tFirst: list[0],
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


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/index/daily_star',
      data: {
        token: wx.getStorageSync('token'),
        type: '1',
        page: that.data.page,
        pagesize: that.data.pagesize
      },
      success(res) {
        if (res.data.code == 1) {
          let list = res.data.data.list
          if (list.length > 2) {
            that.setData({
              tFirst: list[0],
              tSecond: list[1],
              tThird: list[2]
            })
          }
          if (list.length > 1) {
            that.setData({
              tFirst: list[0],
              tSecond: list[1],
            })
          }
          if (list.length > 0) {
            that.setData({
              tFirst: list[0],
            })
          }
          // list.splice(0, 3)
          that.setData({
            list: list
          })
        }
        wx.hideLoading()
      }
    })
  }
})