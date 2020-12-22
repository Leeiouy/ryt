import {
  getIndex
} from '../../config/https';

import {
  formatTime
} from '../../utils/util'




Page({
  data: {
    indexData: null,
    banner: null, //banner图片

    column_a: '',
  },
  onLoad: function (options) {
    this.getData()
  },
  onShow: function () {

  },

  getData() {
    getIndex().then(res => {
      if (res.code == 1) {
        this.setData({
          indexData: res.data,
          banner: res.data.banner
        })
      }
      console.log(res);
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



  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})