// pages/addBankCard/addBankCard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankList: [],  //银行列表
    onIndex: -1,  //默认设置
    region:"请选择开户地区",
    marginBottom:""
  },

  onShow:function(){
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.model.search('iPhone X') != -1) {
          that.setData({
            marginBottom: '40' + 'rpx'
          })
        }
      },
    })
  },

  choseRegion(e){
    console.log(e)
    let region = e.detail.value
    this.setData({
      region:region.join(',')
    })
  },
  onLoad: function () {
    wx.request({
      url: app.baseURL + '/bank/bank_list',
      success: (res) => {
        res.data.data.list.forEach((item, index) => {  //循环添加银行卡列表
          this.data.bankList.push(item.name)
        })
        this.setData({
          bankList: this.data.bankList
        })
      }
    })
  },

  formSubmit(e) {
    const value = e.detail.value;
    console.log(value)
    // const validName = /(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5\.·。]{0,8}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,8}[a-zA-Z]{1}$)/;  //名称正则
    const data = {
      token: wx.getStorageSync('token'),
      realname: value.username,  //开户姓名
      account: value.cardNumber,  //银行卡号
      openbank: value.bank,  //开户银行
      branchbank: value.branch,  //开户支行
    };
    if (!/\S/.test(data.realname)) { this.toast('开户姓名输入错误，请重新输入'); return }
    if (!/\S/.test(data.openbank)) { this.toast('请选择开户银行'); return }
    if (!/\S/.test(data.branchbank)) { this.toast('开户支行不能为空'); return }
    if (!/^([1-9]{1})(\d{15,17})$/.test(data.account)) { this.toast('银行卡号输入错误，请重新输入'); return }
    wx.request({
      url: app.baseURL + '/bank/save_bank_card',
      data: data,
      success: (res) => {
        console.log(res)
        if (res.data.code == 1) {
          wx.showToast({
            title: res.data.msg,
          });

          //获取页面栈
          let pages = getCurrentPages();
          //获取上一个页面
          let prev = pages[pages.length - 2];
          //调用上一个页面的setData方法，从而达到naviagtreBack返回传参的效果
          prev.setData({
            bankCardList: data //选中的银行卡数据
          });
          setTimeout(() => { wx.navigateBack(); }, 2000)
        }
      }
    })
  },

  clickActionSheet() {
    wx.showActionSheet({
      itemList: this.data.bankList,
      success: (res) => {
        this.setData({
          onIndex: res.tapIndex
        })
      },
    })
  },

  toast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none'
    })
  },
})