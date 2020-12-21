import {
  _addressList
} from '../../config/https';
Page({
  data: {
    address_list: [],
    page: 1,
    pagesize: 10
  },
  onLoad: function (options) {
    console.log(_addressList);
  },
  //获取地址列表
  getData() {
    _addressList({
      token: "",
      type: 1,
      page: this.data.page,
      pagesize: this.data.pagesize
    }).then(res => {
      console.log(res);

    })

  },
  toAddressDetail() {
    wx.navigateTo({
      url: '/pages/addressDetail_i/addressDetail_i'
    });
  },
  onReachBottom() {
    this.setData({
      page: this.data.page += 1
    })
    // this.getData()
  }
})