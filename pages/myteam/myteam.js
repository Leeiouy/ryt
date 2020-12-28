// pages/sales/sale/sale.js
const app = getApp();
// import { groupCenter, modalIds } from '../../../../config/https.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    infos: '', // 用户信息
    modals: [], // 模板id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getData();
  },

  // 获取数据
  getData(){
    app.loading();
    let that = this;
    groupCenter({
      token: wx.getStorageSync('userId')
    }).then(res =>{
      if(res.code == 1){
        wx.hideLoading();
        this.setData({
          infos: res.data.info,
        })
        wx.stopPullDownRefresh();

        // if (res.data.info_status == 0){
        //   wx.showModal({
        //     title: '温馨提示',
        //     content: '您尚未完善代理信息,请去先完善信息!',
        //     confirmText: '立即完善',
        //     confirmColor: '#0276B9',
        //     cancelText: '下次再说',
        //     success(data){
        //       if (data.confirm){
        //         wx.navigateTo({
        //           url: '../scanUser/scanUser?storeId=' + res.data.info.store_id,
        //         })
        //       }else{
        //         wx.navigateBack()
        //       }
        //     }
        //   })
        //   return
        // }

        // 订阅模板信息
        modalIds({
          index: 2
        }).then(ress => {
          if (ress.code == 1) {
            wx.getSetting({
              withSubscriptions: true,
              success(data) {
                let text = ress.data[0];
                if (!data.subscriptionsSetting.text) {
                  // that.sureModals();
                }
              }
            })
            this.setData({
              modals: ress.data
            })
          }
        })

      }else{
        wx.hideLoading();
        app.$tip(res.msg)
      }
    })
  },

  // 获取授权信息
  sureModals() {
    let that = this;
    wx.showModal({
      title: '温馨提示',
      content: '好而来需要您授权接收订阅消息',
      confirmColor: '#0276B9',
      success(res) {
        if (res.confirm) {
          wx.requestSubscribeMessage({
            tmplIds: that.data.modals.slice(0, 3),
            success(data) {
            }
          })
        }
      }
    })

  },

  // 去团队
  toTeam(){
    wx.navigateTo({
      url: '/pages/team/team',
    })
  },
  // 去分享
  toShare(){
    wx.navigateTo({
      url: '/pages/share/share',
    })
  },
  // 去分销订单
  toOrder(){
    wx.navigateTo({
      url: '/pages/disOrder/disOrder',
    })
  },
  // 去佣金明细
  toDetail(){
    wx.navigateTo({
      url: '/pages/yongjin_detail/yongjin_detail',
    })
  },
  // 去提现
  toCash(){
    wx.navigateTo({
      url: '/pages/cashsub/cashsub',
    })
  },
  // 去银行卡
  toCard(){
    wx.navigateTo({
      // url: '/pages/cargl/cargl?type=2',
      url: '/pages/myCard/index',
    })
  },

  // 扫码核销
  toSacn(){
    wx.scanCode({
      success(res){
        console.log(res);
        if(res.result){
          wx.setStorageSync('codeData',res.result)
          wx.navigateTo({
            url: '/pages/scanDetail/scanDetail',
          })
        }
      }
    })
  },

  // 核销管理
  scanCharge(){
    wx.navigateTo({
      url: '../scanCharge/scanCharge',
    })
  },

  // 我的资料
  toUser(){
    wx.navigateTo({
      url: '../scanUser/scanUser?storeId=' + this.data.infos.store_id,
    })
  },
  
  onPullDownRefresh: function() {
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})