// pages/aftersale/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:"", // 售后页面数据
    replyReason:"请选择",//退款原因
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {}, //
    isImg:true,
    img:[],
    orderId:"",
    index:'',//退款原因的下标
    reasons: [
      {
        info: "大小/尺寸与商品描述不符",
        selectStates: false,
      },
      {
        info: "颜色/图案/款式与商品描述不符",
        selectStates: false,
      },
      {
        info: "生产日期/保质期与商品描述不符",
        selectStates: false,
      },
      {
        info: "包装/商品损坏/污渍/裂痕/变形",
        selectStates: false,
      },
      {
        info: "卖家发错货",
        selectStates: false,
      },
      {
        info: "个人原因（不喜欢）",
        selectStates: false,
      },
      {
        info: "其他",
        selectStates: false,
      }
      ], //退款原因
    isX:false, //iphone x
  }, 
   // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 720) //先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  choose() {
    let that = this
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn(); //调用显示动画
    }, 200)
  },

  // 选择图片
  showAction() {
    let that = this
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      success: function (res) {

        if (!res.cancel) {
          console.log(res.tapIndex)
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      count:9,
      success: function (res) {
        console.log(res);
          let imgArr = that.data.img
          res.tempFilePaths.forEach(item =>{
            imgArr.push(item)
            that.setData({
              img: imgArr,
              isImg: false
            })
          })
        
      }
    })
  },
  // 选择图片end



  // 删除照片
  imgDelete(e){
    let that = this
    let imgs = that.data.img,
    index = e.currentTarget.dataset.index
    imgs.splice(index,1)
    wx.showModal({
      title: '提示',
      content: '是否删除该图片',
      success(res){
        if (res.confirm) {
          that.setData({
            img: imgs,
            // isImg: true
          })
        }
      }
    })
  },
  //选择退款原因
  selectReason(e) {
    var that = this;
    let info = e.currentTarget.dataset.info
    let index = e.currentTarget.dataset.index
    let reasonList = that.data.reasons
    reasonList[index].selectStates = !reasonList[index].selectStates
    that.setData({
      replyReason:info,
      reasons:reasonList,
      index:index
    })
    console.log(that.data.index)
    var animation = wx.createAnimation({
      duration: 800, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    that.animation = animation
    that.fadeDown(); //调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 720) //先执行下滑动画，再隐藏模块
  },

  //提交申请
  formsubmit(e){
    let that = this
    let desc = e.detail.value.reasondesc
    if(!desc){
      wx.showToast({
      title: '请输入退款详细问题',
      icon:"none"
    })
    return;
  }else if(!that.data.index){
    wx.showToast({
      title: '请选择退款原因',
      icon:"none"
    })
    return;
  }
    let imgs = that.data.img.join(',')
    console.log(imgs)
    wx.request({
      url: app.baseURL +'/order/applyAfterSale',
      data:{
        token:wx.getStorageSync('token'),
        order_id:that.data.orderId,
        refund_reason: that.data.replyReason,
        rerefund_question:desc,
        refund_images:imgs
      },
      success(res){
        console.log(res)
        if(res.data.code==1){
          wx.showToast({
            title: res.data.msg,
            icon:"none"
          })
          wx.redirectTo({
            url: '../order/index?state=1',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options)
    that.setData({
      orderId : options.orderid
    })
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/order/getApplyAfterSaleInfo',
      data: {
        token: wx.getStorageSync('token'),
        order_id: options.orderid
      },
      success(res) {
        console.log(res)
        if(res.data.code == 1){
          that.setData({
            data:res.data.data
          })
        }
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)

        if (res.model.search('iPhone X') != -1) {
          that.setData({
            isX: true
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})