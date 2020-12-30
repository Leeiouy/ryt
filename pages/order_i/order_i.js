import {
  _orderList,
  _cancleOrder,
  _confirmOrder
} from '../../config/https'
Page({
  data: {
    active: 0, //tab默认下标



    list: null, //订单列表
    orderStatus: 1, // 订单状态 (1）全部 (10）待确定 (20）待发货 (30）待收货 (50）已完成
    page: 1,
    pagesize: 10

  },
  onLoad: function (options) {},

  onShow: function () {},

  getOrderList() {
    _orderList({
      token: wx.getStorageSync('token'),
      order_status: this.data.orderStatus,
      page: this.data.page,
      pagesize: this.data.pagesize
    }).then(res => {


    })

  },
  onReachBottom: function () {

  },
})