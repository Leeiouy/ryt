// pages/myteam/index.js
const app = getApp()
Page({
  data: {
    hasLogin: true,//判断有无登录
    currentIndex: 0,
    count: "0",
    twoCount: "0",
    threeCount: "0",
    isNone: false,
    level: "",
    list: [],
    second_id: '',  //上级id
  },
  see(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/myteam2/index?id=${id}`
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
    this.setData({ second_id: options.id })
    this.init(1)
  },
  init(level) {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/distribution/team',
      data: {
        second_id: this.data.second_id,
        token: wx.getStorageSync('token'),
        level: level
      },
      success(res) {
        if (res.data.code == 1) {
          let list = res.data.data.list
          list.forEach(item => {
            if (item.level == 1) {
              that.setData({
                count: list.length
              })
            }
            if (item.level == 2) {
              that.setData({
                twoCount: list.length
              })
            }
            if (item.level == 3) {
              that.setData({
                threeCount: list.length
              })
            }
          })
          that.setData({
            list: res.data.data.list,
            isNone: !res.data.data.list.length
          })
        }
        wx.hideLoading()
      }
    })
  },
})