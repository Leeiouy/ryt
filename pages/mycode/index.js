// pages/mycode/index.js
const app = getApp();

Page({
  data: {
    wechat_num: '', // 微信号
    avatar: '',
    dataUrl: '',
  },
  onShow: function () {
    let that = this;
    wx.request({
      url: app.baseURL + '/Mycenter/userInfo?token=' + wx.getStorageSync('token'),
      success(res) {
        if (res.data.code == 1) {
          let dataUrl = ""
          if (res.data.data.wxcode){
            dataUrl = res.data.data.wxcode.split('https://riyuetaoguoji.com')[1]
          }
          that.setData({
            dataUrl,
            avatar: res.data.data.wxcode,
            wechat_num: res.data.data.wechat_num == '日悦淘会员' ? '' : that.data.wechat_num
          })
          if (!that.data.wechat_num){
            that.setData({
              wechat_num: wx.getStorageSync('wxName')
            })
          }
         
        }
      }
    })
  },

  // 微信号
  init(e){
    this.setData({
      wechat_num: e.detail.value
    })
  },

  //上传更改后的信息
  fileImg(){
    let that = this;
    let wxName = that.data.wechat_num;
    console.log(that.data.wechat_num)
    if (!that.data.wechat_num){
      wx.showToast({
        title: '请填写微信号!',
        icon: 'none'
      })
      return
    }
    if (!that.data.dataUrl){
      wx.showToast({
        title: '请选择二维码!',
        icon: 'none'
      })
      return
    }
    wx.setStorageSync('wxName', wxName)
    wx.request({
      url: app.baseURL + '/user/profile',
      data: {
        token: wx.getStorageSync('token'),
        wxcode: that.data.dataUrl,
        wechat_num: wx.getStorageSync('wxName') ? wx.getStorageSync('wxName') : that.data.wechat_num,
        type: 2
      },
      success(res) {
        let str = res.data.code == 1 ? res.data.msg : '请修改后再提交'
        wx.showToast({
          title: str,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  // 选择图片
  chooseImg(){
    let that = this;
    wx.chooseImage({
      success: function(datas) {
        wx.uploadFile({
          url: app.baseURL + '/User/uploadSinglePicture',
          filePath: datas.tempFilePaths[0],
          name: 'file',
          formData: {
            image: datas.tempFilePaths[0],
            type: 2
          },
          success: (suc) => {
            let data = JSON.parse(suc.data); //由于拿到的数据未解析，这里先解析json
            if (data.code == 1) {
              that.setData({
                avatar: datas.tempFilePaths[0],
                dataUrl: data.data
              })
            }
          }
        })
      },
    })
  }
})