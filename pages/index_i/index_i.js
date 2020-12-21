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
  },
  onLoad: function (options) {
    this.getData()
  },
  onShow: function () {

  },

  getData() {
    getIndex().then(res => {
      if (res.code == 1) {

        res.data.djk_item_list.forEach(v=>console.log(v))
        this.setData({
          indexData: res.data,
          banner: res.data.banner
        })
      }
      console.log(res);
    })
  },




  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})