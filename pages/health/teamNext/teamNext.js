// pages/myteam/index.js
const app = getApp()
const https = require('../../../config/https')
Page({
  data: {
    hasLogin: true, //判断有无登录
    currentIndex: 0,
    count: "0",
    twoCount: "0",
    threeCount: "0",
    isNone: false,
    level: "",
    list: [],
    second_id: '', //上级id
    page: 1,
    pagesize: 10
  },
  see(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `./teamNext?id=${id}`
    })
  },
  tab: function (e) {
    let index = e.currentTarget.dataset.index
    let type= e.currentTarget.dataset.type
    this.setData({
      currentIndex: index,
      type,
      page: 1,
      isNone: false,
      list: []
    })
    this.init(type)
  },
  onLoad: function (options) {
    this.setData({
      second_id: options.id
    })
    this.init(1)
  },
  init(level) {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    https.myTeam({
      second_id: this.data.second_id,
      token: wx.getStorageSync('token'),
      // token: 'b0920589-e08b-473d-b26b-b35b64fe2f53',
      distributor: level,
      page: this.data.page,
      pagesize: this.data.pagesize
    }).then(res => {
      if (res.code == 1) {
        let title = res.data.title
        wx.setNavigationBarTitle({
          title: title,
        })
        let temp = res.data.list
        temp.forEach(item => {
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
        let list = this.data.list
        list = [...list, ...temp]
        that.setData({
          list,
          isNone: !temp.length
        })
      }
      wx.hideLoading()
    })
  },
  onReachBottom () {
    if (!this.data.isNone) {
      this.setData({
        page: this.data.page + 1
      })
      this.init(this.data.type)
    }
  }
})