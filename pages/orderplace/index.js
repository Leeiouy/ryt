// pages/orderplace/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    add_res: null, //地址信息
    goodsInfo:"",//商品
    status:"",
    order:"",
    isX:false,
    flag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data,
    that =this,
    freight= options.freight
    console.log(options)
    if (options.status == 2){
      data={
        token:wx.getStorageSync('token'),
        status:"2",
        goods_id: options.item_id,
        goods_spec_id: options.gui_id,
        num: options.item_num,
        type: options.type,
      }
      wx.request({
        url: app.baseURL + '/order/getConfirmOrder',
        data:data,
        success(res){
          console.log(res)
          if(res.data.code == 1){
            that.setData({
              add_res:res.data.data.address,
              goodsInfo: res.data.data.list,
              order:res.data.data
            })
          }else if(res.data.code == 0){
            wx.showModal({
              title: '温馨提示',
              content: res.data.msg,
              success(res){
                if(res.confirm){
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }else if(res.cancel){
                  wx.switchTab({
                    url: '../index/index',
                  })
                }
              }
            })
          }
        }
      })
    } else if (options.status == 1){
      data = {
        token: wx.getStorageSync('token'),
        status: "1",
        shoping_cart_ids: JSON.parse(options.idArr).join(','),
      }
      wx.request({
        url: app.baseURL + '/order/getConfirmOrder',
        data: data,
        success(res) {
          console.log(res)
          if (res.data.code == 1) {
            that.setData({
              add_res: res.data.data.address,
              goodsInfo: res.data.data.list,
              order: res.data.data
            })
          }
        }
      })
    }
  },

  //前往添加收货地址
  toAddAddress() {
    wx.navigateTo({
      url: '/pages/addresselete/index?select=true',
    })
  },

  //去选择收货地址
  selectAddress() {
    wx.navigateTo({
      url: '/pages/addresselete/index?select=true',
    })
  },

  //点击提交按钮
  submitOrder(e) {
    if (this.data.flag) {
      this.setData({
        flag: false
      })
      let that = this
      //如果没有添加收货地址提醒用户添加收货地址
      if (!this.data.add_res) { wx.showToast({ title: '请添加收货地址', icon: 'none' }); return; }
      if (this.data.order.status == 1) {
        let data = {
          token: wx.getStorageSync('token'),
          shoping_cart_ids: JSON.parse(this.options.idArr).join(','),
          status: this.data.order.status,
          num: this.options.totalNum,
          address_id: this.data.add_res.address_id,
          totalprice: this.data.order.totalprice,
          freight: this.data.order.freight,
          remark: e.detail.value.remark,
          type: this.data.order.type
        }
        console.log(data)
        wx.request({
          url: app.baseURL + '/order/setProductionOrder',
          data: data,
          success(res) {
            console.log(res)
            if (res.data.code == 1) {

              wx.redirectTo({
                url: '../orderSuccess/index?total=' + data.totalprice,
              })
            } else if (res.data.code == 0) {
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              })
            }
          }
        })
      } else if (this.data.order.status == 2) {
        let data = {
          token: wx.getStorageSync('token'),
          status: "2",
          goods_id: this.options.item_id,
          goods_spec_id: this.options.gui_id,
          num: this.options.item_num,
          address_id: this.data.add_res.address_id,
          totalprice: this.data.order.totalprice,
          freight: this.data.order.freight,
          remark: e.detail.value.remark,
          type: this.data.order.type
        }
        console.log(data)
        wx.request({
          url: app.baseURL + '/order/setProductionOrder',
          data: data,
          success(res) {
            console.log(res)
            if (res.data.code == 1) {

              wx.redirectTo({
                url: '../orderSuccess/index?total=' + data.totalprice,
              })
            } else if (res.data.code == 0) {
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              })
            }
          },
          fail(err) {
            wx.showToast({
              title: '网络错误',
              icon: "none"
            })
          }
        })
      }
      wx.hideLoading() 
    }
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