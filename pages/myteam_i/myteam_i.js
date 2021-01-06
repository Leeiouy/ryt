// pages/myteam_i/myteam_i.js

import {
  _myTeam,
  _mySale,
  _salesStatistics
} from '../../config/https';
Page({
  data: {
    myInfo: null, //个人业绩


    //-------------团队列表相关----------------------
    teamList: null,
    page: 1,
    pagesize: 10,


  },
  onLoad: function (options) {
    this.getMyinfo()
    this.getMyteamList()
  },
  onShow: function () {

  },

  //获取我的业绩
  getMyinfo() {
    _mySale({
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 1) {
        this.setData({
          myInfo: res.data.data
        })
      }
    })
  },
  //获取团队列表
  getMyteamList() {
    _myTeam({
      token: wx.getStorageSync('token'),
      second_id: "",
      level: "",
      page: this.data.page,
      pagesize: this.data.pagesize,
    }).then(res => {
      if (res.code == 1) {
        this.setData({
          teamList: [...this.data.teamList, ...res.data.list]
        })
      }
    })

  },










  onReachBottom: function () {

  },

})