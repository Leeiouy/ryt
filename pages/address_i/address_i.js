import {
  _addressList
} from '../../config/https';
const app = getApp()
Page({
  data: {
    address_list: [],
    page: 1,
    pagesize: 10,
    type:null
  },
  onLoad: function (options) {
    options.type&&this.setData({
      type:options.type
    })
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

    if (this.data.type == 'order') {
      //获取页面栈
      let pages = getCurrentPages();
      //获取上一个页面
      let prev = pages[pages.length - 2];
      //调用上一个页面的setData方法，从而达到naviagtreBack返回传参的效果
      //简单粗暴
      prev.setData({
        add_res: e.currentTarget.dataset.info //添加的地址数据
      });
      wx.navigateBack();
    } else {
      let info = JSON.stringify(e.currentTarget.dataset.info);
      wx.navigateTo({
        url: `/pages/addressDetail_i/addressDetail_i?info=${info}`
      });
    }

  },
  onReachBottom() {
    this.setData({
      page: this.data.page += 1
    })
    this.getData()
  }
})