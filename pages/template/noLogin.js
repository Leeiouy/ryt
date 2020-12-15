const app = getApp();
const showNoLogin = (that) => {
  return new Promise(function (resolve, reject) {
    var userId = app.globalData.userId;
    if (!wx.getStorageSync('userInfo')) {
      // 查看是否授权
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.userInfo']) {  //判断是否授权
            that.setData({hasUserInfo: false,});
            reject();  //判断用户数据不存在本地或者用户未授权 ---> 弹出授权窗口
          }else{
            app.userLogin(() => {
              getUserData().then((res) =>{
                console.log(res)
                resolve();  //用户信息存在本地  ----> 直接登录
              }).catch(err=>{
                console.log(err)
              })
            })
            // 用户登录--->
          }
        }
      });
    }else{
      that.setData({ hasUserInfo: true });
      app.userLogin(() =>{
        resolve();  //用户信息存在本地  ----> 直接登录
      }); // 用户登录  --->
    }
  });
}
const getUserData = (that) => {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      success: (res) => {
        wx.setStorageSync("userInfo", res.userInfo);
        wx.showLoading({ title: '更新中...' });
        if (res.userInfo) {
          wx.request({
            url: app.baseURL + 'Mine&a=update_user_info',
            data: {
              user_id: app.globalData.userId,
              nickname: res.userInfo.nickName,  //上传用户昵称
              url: res.userInfo.avatarUrl  //上传用户头像
            },
            success: (res) => {
              wx.hideLoading();
              resolve();
            },
            fail: function (res) {
              wx.showToast({
                title: '网络错误，请重试',
                icon: 'none'
              });
            }
          });
        }
      },fail(res){
        console.log(res)
      }
    })
  })
}
module.exports = {
  showNoLogin: showNoLogin,  //授权窗口
  getUserInfo: getUserData,  //获取授权信息  
}