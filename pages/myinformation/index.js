// pages/myinformation/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: "",
    nickName: "",
    editName: "", //修改昵称
    data: "",
    dataUrl: "" ,//头像
    genderArr:['女','男'],
    gender:""
  },
  showAction() {
    let that = this
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      success: function(res) {
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
  chooseWxImage: function(type) {
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
        console.log(res);
        // that.setData({
        //   // tempFile   ath可以作为img标签的src属性显示图片
        //   avatar: res.tempFilePaths[0],
        // })
        var tempFilePaths = res.tempFilePaths;
        wx.navigateTo({
          url: "/pages/avatarCut/index?src=" + tempFilePaths
        });
        // wx.uploadFile({
        //   url: app.baseURL + '/User/uploadSinglePicture',
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   // header: {
        //   //   token: wx.getStorageSync('token'),
        //   //   image: tempFilePaths[0],
        //   // },
        //   formData: {
        //     image: tempFilePaths[0],
        //     type: 1
        //   },
        //   success: (suc) => {
        //     console.log(suc)
        //     let data = JSON.parse(suc.data); //由于拿到的数据未解析，这里先解析json
        //     console.log(data)
        //     if (data.code == 1) {
        //       wx.showToast({
        //         title: '头像上传成功',
        //         icon: 'none'
        //       });
        //       that.setData({
        //         avatar: tempFilePaths[0],
        //         dataUrl: data.data
        //       })
        //     }
        //     wx.request({
        //       url: app.baseURL + '/user/profile',
        //       data: {
        //         token: wx.getStorageSync('token'),
        //         avatar: that.data.dataUrl,
        //         type: 1
        //       },
        //       success(res) {
        //         console.log(res)
        //         if (res.data.code == 1) {
        //           // wx.showToast({
        //           //   title: res.data.msg,
        //           // })
        //         }
        //       }
        //     })
        //   }
        // })
      }
    })
  },
  // 性别
  selectGender(e){
    console.log(e.detail.value)
    let genderArr = this.data.genderArr
    this.setData({
      gender: genderArr[e.detail.value]
    })
    this.editUserinfo()
  },
  init() {
    
    const token = wx.getStorageSync('token');
    if (token) {
      wx.request({
        url: app.baseURL + '/Mycenter/userInfo?token=' + token,
        success: (res) => {
          if(res.data.data.gender == 1){
            this.setData({
              gender:"男"
            })
          }
          if (res.data.data.gender == 2) {
            this.setData({
              gender: "女"
            })
          }
          if (res.data.code == 1) {
            // console.log(res.data.data.avatar)
            this.setData({
              data: res.data.data,
              avatar: res.data.data.avatar,
              nickName: res.data.data.username
            })
          }
        }
      })
    }
  },


  editUserinfo() {
    let that = this
    console.log(that.data.avatar)
    wx.request({
      url: app.baseURL + '/user/profile',
      data: {
        token: wx.getStorageSync('token'),
        avatar: that.data.dataUrl,
        gender: that.data.gender == '女' ? '2' :'1'
      },
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          // wx.showToast({
          //   title: res.data.msg,
          // })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      editName: options.nickName
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.init()
    this.setData({
      nickName: this.options.nickName
    })
  }
})