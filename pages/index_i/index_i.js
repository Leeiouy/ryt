import {
  getIndex
} from '../../config/https'




Page({
  data: {
    indexData: null,
    banner: null,//banner图片
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
          banner:res.data.banner
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