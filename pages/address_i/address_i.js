import {
  _addressList
} from '../../config/https';
const app = getApp()
Page({
  data: {
    address_list: [],
    page: 1,
    pagesize: 10
  },
  onLoad: function (options) {

  },
  onShow() {
    this.setData({
      address_list: [],
      page: 1,
      pagesize: 10
    })
    this.getData()

  },
  //获取地址列表
  getData() {
    _addressList({
      token: wx.getStorageSync('token'),
      type: 1,
      page: this.data.page,
      pagesize: this.data.pagesize
    }).then(res => {
      if (res.code == 1) {
        this.setData({
          address_list: [...this.data.address_list, ...res.data.list]
        })
      } else {
        app.Toast(res.data.msg)
      }
    })
  },
  //去添加收货地址
  toAddressDetail() {
    wx.navigateTo({
      url: '/pages/addressDetail_i/addressDetail_i'
    });
  },
  //点击收货地址去修改
  toDetail(e) {
    let info = JSON.stringify(e.currentTarget.dataset.info);
    wx.navigateTo({
      url: `/pages/addressDetail_i/addressDetail_i?info=${info}`
    });
  },
  onReachBottom() {
    this.setData({
      page: this.data.page += 1
    })
    this.getData()
  }
})