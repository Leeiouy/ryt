// pages/productdetail/index.js
const app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
var utils = require("../../../utils/util.js");
const https = require('../../../config/https')
Page({
  data: {

    //-----------------数据-----------------
    goodsId: "", //商品id
    goodsData: "", //商品内容
    //-----------------规格栏选中数据-----------------
    count: 1, //购买数量  不能超过库存
    guigeIdArr: [], //规格id 多规格将会存储为多个




    //-----------------逻辑-----------------

    share_list: [{
        name: '微信',
        icon: 'wechat',
        openType: 'share'
      },
      {
        name: '复制链接',
        icon: 'link'
      },
      {
        name: '分享海报',
        icon: 'poster'
      },
    ],
    infoShow: false, //规格弹窗展示
    showShare: false, //分享弹窗


    bannerHeight: [], //banner图片每张的高度

    currentNum: 1, //轮播图下标











    activeIndex: 0,


  },
  onLoad: function (options) {
    this.setData({
      goodsId: options.goods_id,
      isBigHealth: options.isBigHealth || 0
    })
  },
  onShow: function () {
    this.getData()
  },
  //获取数据
  getData() {
    https._goodsDetail({
      goods_id: this.data.goodsId,
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 1) {
        //  调用wxParse解析html文本
        res.data.content && WxParse.wxParse('goodsinfo', 'html', res.data.content, this, 5);
        res.data.end_time && res.data.start_time ? res.data.remainingTime = (Number(res.data.end_time) - Number(res.data.start_time)) * 1000 : '';
        this.setData({
          goodsData: res.data
        })
      }
    })
  },
  //是否登录
  isLogin() {
    if (!wx.getStorageSync('token')) {
      wx.showModal({
        title: '温馨提示',
        content: '您暂未登录，是否要去登录？',
        confirmText: "确定",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
      return false
    } else {
      return true
    }
  },
  //--------------------------底部栏相关事件----------------------------------
  //收藏
  collect(e) {
    if (!this.isLogin()) {
      return
    }
    const token = wx.getStorageSync('token');
    const itemId = this.data.goodsData.goods_id;
    https._goodsCollection({
      token,
      itemId,
      type: "1",
      status: this.data.goodsData.is_collect ? 1 : 2
    }).then(res => {
      console.log(res);
    })
  },
  //立即购买按钮
  buyGoodsBtn() {
    if (!this.isLogin()) {
      return
    }
    this.setData({
      infoShow: true,
      isBuy: true,
      isAddCar: false,
    })
  },

  //--------------------------规格弹窗相关事件----------------------------------

  //选中规格id
  setGuige(e) { //多规格用数组存贮 发送网络请求会join这个数组把多规格id取出来
    let id = e.currentTarget.dataset.guigeid;
    let index = e.currentTarget.dataset.i;
    this.setData({
      [`guigeIdArr[${index}]`]: id
    })
  },
  //修改购买数量
  onChangeCount(e) {
    let value = e.detail;
    this.setData({
      count: value
    })
  },
  //立即购买商品
  buyGoods() {
    wx.navigateTo({
      url: '/pages/orderplace/index'
    });
  },
  //点击遮罩层关闭弹窗栏
  overlayClick() {
    this.setData({
      infoShow: false,
      count: 1,
      guigeIdArr: []
    })
  },




  //-------------------------分享弹窗相关事件----------------------------------
  share() {
    this.setData({
      showShare: true
    })
  },
  onShareClose() {
    this.setData({
      showShare: false
    })
  },














  // 轮播图切换
  change: function (e) {
    let current = e.detail.current + 1
    this.setData({
      currentNum: current > 3 ? current - 3 : current
    })
  },

  //商品评价类型---选项卡切换
  toMaterial(e) {
    let data = {
      shareDesc: this.data.goodsData.share_descr,
      shareContent: this.data.goodsData.share_content,
      shareImg: this.data.goodsData.share_images,
      image: this.data.goodsData.image,
      goods_id: this.data.goodsData.goods_id,
      my_img: this.data.goodsData.images
    }
    let metaril = JSON.stringify(data)
    wx.setStorageSync('metaril', metaril)
    wx.navigateTo({
      url: '../material/material',
    })
  },





  //bannerImg 加载好函数
  imgLoad(e) {
    let height = e.detail.height;
    let width = e.detail.width;
    let H = this.data.bannerHeight;
    console.log(e);
    H.push(height)
    this.setData({
      bannerHeight: H
    })
  },

  onShareAppMessage: function () {
    return {
      title: '',
      imageUrl: this.data.banner[0]
    }
  }
})