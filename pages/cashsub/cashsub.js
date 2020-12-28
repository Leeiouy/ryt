// pages/sales/cashsub/cashsub.js
const app = getApp();
// import { cash, cashInfo } from '../../../../config/https.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0, // 默认提现方式 0微信 1银行卡
    wxNumber: '', // 微信号
    bankCard: '', // 银行卡信息
    money: '', // 提现金额
    info: '', // 提现信息
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
    // if(this.data.bankCard){
    //   let news = this.data.bankCard;
    //   let number = news.account.slice(-4, this.data.bankCard.account.length);
    //   news.account = number;
    //   this.setData({
    //     bankCard: news
    //   })
    //   console.log(news)
    // }
  },

  // 获取信息
  getData(){
    cashInfo({
      token: wx.getStorageSync('userId'),
      withdrawal_way: 1
    }).then(res =>{
      if(res.code == 1){
        this.setData({
          info: res.data
        })
      }else{
        app.$tip(res.msg)
      }
    })
  },

  // 选择提现方式
  chooseType(e){
    this.setData({
      type: e.currentTarget.dataset.type
    })
  },

  //  输入微信号
  init(e){
    this.setData({
      wxNumber: e.detail.value
    })
  },

  // 选择银行卡
  chooseCard(){
    wx.navigateTo({
      url: '../cargl/cargl?type=1',
    })
  },

  // 输入金额
  initMoney(e){
    this.setData({
      money: e.detail.value
    })
  },

  // 全部提现
  cashAll(){
    if (this.data.info.user_info.balance){
      this.setData({
        money: this.data.info.user_info.balance
      })
    }else{
      this.setData({
        money: ''
      })
    }
  },

  // 提现按钮
  submit(){
    if(this.data.type == 0 && !this.data.wxNumber){
      app.$tip('请输入真实姓名!')
      return
    }
    if(this.data.type == 1 && !this.data.bankCard){
      app.$tip('请选择银行卡!')
      return
    }
    if(!this.data.money){
      app.$tip('请输入提现金额!');
      return
    }
    if(this.data.type == 0){
      if (this.data.info.wx_min_withdraw && Number(this.data.money) < Number(this.data.info.wx_min_withdraw)){
        app.$tip('最低提现' + this.data.info.wx_min_withdraw +'元!');
        return
      }
    }
    if(this.data.type == 1){
      if (this.data.info.min_withdraw && Number(this.data.money) < Number(this.data.info.min_withdraw)){
        app.$tip('银行卡最低提现' + this.data.info.min_withdraw +'元!');
        return
      }
    }
    if (Number(this.data.money) > Number(this.data.info.balance)){
      app.$tip('可提现金额不足!');
      return
    }

    app.loading();
    cash({
      token: wx.getStorageSync('userId'),
      bank_id: this.data.bankCard ? this.data.bankCard.id : '',
      money: this.data.money,
      type: this.data.type == 0 ? 1 : 2,
      name: this.data.wxNumber ? this.data.wxNumber : ''
    }).then(res =>{
      wx.hideLoading();
      if(res.code == 1){
        app.$tip(res.msg);
        setTimeout(()=>{
          wx.navigateBack()
        },1200)
      }else{
        app.$tip(res.msg)
      }
    })
  },
})