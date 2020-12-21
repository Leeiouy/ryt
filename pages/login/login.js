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
       url: 'pages/index/index'
     })
   },
   toBack() {
     wx.navigateBack({
       delta: 1
     });
   },
   //用户点击按钮发起授权
   WeChatUserInfo: function (e) {
     let rawData = e.detail.rawData;
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
               setTimeout(() => {
                 this.data.status ? this.toIndex() : this.toBack();
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