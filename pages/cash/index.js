// pages/cash/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: "",
    cash: "",
    bankId:"", //银行卡id
    or:"", //银行卡号
    bankName:"选择银行卡"//银行名称
  },
  allDraw(e) {
    let cash = e.currentTarget.dataset.balance
    this.setData({
      cash: cash
    })
  },

  formsubmit(e) {
    let that = this
    console.log(e)
    let cash = e.detail.value.cash
    let bankId = that.data.bankId
    let minWidthdraw = e.detail.target.dataset.min
    if (!cash) {
      wx.showToast({
        title: '请输入提现金额',
        icon:"none"
      })
      return
    }
    if(cash<minWidthdraw){
      wx.showToast({
        title: '提现金额不能小于200',
        icon: "none"
      })
      return
    }
    wx.showModal({
      title: '温馨提示',
      content: '是否提现到银行卡',
      success(res){
        if(res.confirm){

          wx.request({
            url: app.baseURL + '/bank/apply_withdraw',
            data: {
              token: wx.getStorageSync('token'),
              money: cash,
              bank_id: bankId
            },
            success(res) {
              if (res.data.code == 0) {
                wx.showToast({
                  title: res.data.msg,
                  icon: "none"
                })
              } else if (res.data.code == 1) {
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.msg,
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.navigateBack()
                    }
                  }
                })
              }
            }
          })
        }else if(res.cancel){
          
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    wx.request({
      url: app.baseURL + '/bank/withdraw_info?token=' + wx.getStorageSync('token'),
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            data: res.data.data,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})