// pages/address/address.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin:true,  //是否登录
    addressList: [], //收货地址列表
    active: '', //默认收货地址
    keyWord: "", //输入搜索
    isNone: false, //为空提示， false隐藏为空提示，true显示为空提示
    level:"", //用户等级
    page: 1,//页数
    // num: '',//总页数
    marginBottm:0,//iphonex
    isX: false,//iphonex
    show:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    if (options.select) {
      this.fromPlaceorder = true
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!wx.getStorageSync('token')) {
      this.setData({
        hasLogin: false
      })
      wx.showModal({
        title: '温馨提示',
        content: '您还未登录,是否去登录?',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.redirectTo({
              url: '../logintwo/index',
            })
          }
          if (res.cancel) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    } else {
      const token = wx.getStorageSync('token');
      this.setData({
        page:1,
        addressList:[],
        show:true
      });
      token && this.init(token, wx.hideLoading());

      wx.request({
        url: app.baseURL + '/Mycenter/userInfo?token=' + wx.getStorageSync('token'),
        success: (res) => {
          if (res.data.code == 1) {
            let level = res.data.data.level
            console.log(level)
            this.setData({
              level: Number(level)
            })
          }
        }
      })
      let that = this
      wx.getSystemInfo({
        success: function(res) {
          if (res.model.search('iPhone X') != -1){
            that.setData({
              marginBottm:68,
              isX:true
            })
          }
          if (res.model.search('iPhone 11') != -1) {
            that.setData({
              marginBottm: res.statusBarHeight,
              isX: true
            })
            // console.log((res.screenWidth) / 750)
          }
        },
      })
    }
  },

  //初始化数据
  init(token, cb){
    let that = this
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: app.baseURL + '/Adress/getAddress',
      data:{
        token: token,
        type:'1',
        page: that.data.keyWord ? 1:that.data.page,
        pagesize:that.data.keyWord ? 30 : 100,
        search: that.data.keyWord,
      },
      success: (res) => {
        console.log(res)
        // that.data.num = res.data.data.list.length / 6;
     
        if (res.statusCode == 200) {
          if(res.data.code == 1){
            if(that.data.keyWord){
              that.setData({
                addressList: res.data.data.list,
              
              });
            }else{
              let address_list = that.data.addressList
              if(res.data.data.list.length > 0){
                let page = that.data.page + 1
                for(let i = 0 ;i < res.data.data.list.length ; i++){
                  address_list.push(res.data.data.list[i])
                }
                that.setData({
                  addressList:address_list,
                  page:page
                })
              }else{
                that.setData({
                  show:false
                })
              }
            }
           
            that.setData({
              isNone: !that.data.addressList.length,
            })
            
          } else if (res.data.code == 0 && wx.getStorageSync('token')) {
            wx.clearStorageSync('token')
            wx.showToast({
              title: '请重新登陆',
              icon: "none"
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '../logintwo/index',
              })
            }, 2000)
          }
          wx.hideLoading();
          typeof cb == 'function' && cb();
        }
      }
    })
   
  },

  //触底操作
  onReachBottom: function () {
    let that = this;
    const token = wx.getStorageSync('token');
    if(that.data.show){
      that.init(token)
    }
  },

  //设置默认收货地址
  setDefault(e){
    const id = e.currentTarget.dataset.id;
    const status = e.currentTarget.dataset.status;
    const token = wx.getStorageSync('token');
    let addressList = this.data.addressList;
    if (status == 1) { return };
    wx.showLoading({ title: '加载中' });
    //发送请求
    wx.request({
      url: app.baseURL + '/Adress/setDefault',
      data: {
        address_id: id, //地址id
        token: token //用户id
      },
      success: (res) => {
        if (res.statusCode == 200) {
          wx.hideLoading();
          //刷新页面数据
          this.init(token);
        }
      }
    })
  },

  //删除收货地址
  clickDeleteAddress(e){
    const status = e.currentTarget.dataset.status;
    const token = wx.getStorageSync('token');
    const id = e.currentTarget.dataset.id;
    //不能删除默认收货地址
    if (status == 1) { wx.showToast({ title: '不可删除默认地址', icon: 'none' }); return; }
    wx.showModal({
      title: '温馨提示',
      content: '确定删除此收货地址吗',
      confirmColor: "#f13130",
      success: (res) => {
        if (res.confirm) {
          //点击确认时
          wx.request({
            url: app.baseURL + '/Adress/delAddress',
            data: {
              address_id: id,
              token: token
            },
            success: (res) => {
              if (res.data.code == 1) {
                this.setData({
                  page: 1,
                  addressList: [],
                  show: true
                });
                //刷新页面数据
                this.init(token);
              }
            },
            fail: (err) => { wx.showToast({ title: '网络错误，请稍后重试', icon: 'none' }); }
          });
        }
      }
    })
  },

  //前往编辑地址页面
  editAddress(e) {
    console.log(e)
    let item = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/addressModify/addressModify?item=' + item,
    })
  },

  // 搜索地址
  searchAddress(e) {
    const token = wx.getStorageSync('token');
    let keyWord = e.detail.value
    this.setData({
      keyWord
    })
    this.init(token,this.data.search)
  },
    
  
})