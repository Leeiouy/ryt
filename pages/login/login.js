 // pages/login/login.js
 import {
   wxLogin
 } from '../../config/https';
 const app = getApp();
 Page({
   data: {
     status: 0 //跳转状态 0跳转回主页，1返回上一个页面
   },
   onLoad(options) {
     this.setData({
       status: options.status || 0
     })
   },
   toIndex() {
     wx.switchTab({
       url: '/pages/index_i/index_i',
       fail: (e)=>{console.log(e);},
     })
   },
   toBack() {
     wx.navigateBack();
   },
   //用户点击按钮发起授权
   WeChatUserInfo: function (e) {
     let rawData = e.detail.rawData;
     let that = this;
     wx.login({
       success(res) {
         if (res.code) {
           let code = res.code;
           wxLogin({
             code,
             rawData
           }).then(res => {
             console.log(res);
             if (res.code == 1) {
               app.Toast('登录成功～', 'success')

               wx.setStorageSync('token', res.data.userInfo.token);
               wx.setStorageSync('userInfo', res.data.userInfo);

               setTimeout(() => {
                 that.data.status ? that.toBack() : that.toIndex();
               }, 1500);
             } else {
               app.Toast('授权登录失败,请重试！')
             }
           })
         } else {
           app.Toast('授权登录失败,请重试！')
         }
       }
     })

   }
 })