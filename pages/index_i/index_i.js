import {
  _getIndex
} from '../../config/https';

import {
  formatTime
} from '../../utils/util'




Page({
  data: {
    indexData: null,
    banner: null, //banner图片
    column_a: '',




    skeletonShow:true//骨架屏显示
  },
  onLoad: function (options) {
    this.getData()
  },
  onShow: function () {

  },

  getData() {
    _getIndex().then(res => {
      if (res.code == 1) {
        res.data.item_list.forEach(v => {
          v.remainingTime = (Number(v.end_time) - Number(v.start_time)) * 1000
        })
        this.setData({
          indexData: res.data,
          banner: res.data.banner,
          skeletonShow:false
        })
      }

    })
  },



  columnTap(e) {
    let val = e.currentTarget.dataset.active
    if (val == this.data.column_a) {
      this.setData({
        column_a: ''
      })
    } else {
      this.setData({
        column_a: val
      })

    }

  },
  goodsDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/health/detail/detail?goods_id=${id}`
    });
  },

  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})