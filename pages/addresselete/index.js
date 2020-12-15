// pages/address/address.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: null, //收货地址列表
    active: '', //默认收货地址
    keyWord: "", //输入搜索
    isNone: false, //为空提示， false隐藏为空提示，true显示为空提示
    //为空提示
    emptyTip: {
      font: "您还未添加收货地址~",
      imgUrl: "/images/none-order.png"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.select) {
      this.fromPlaceorder = true
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const token = wx.getStorageSync('token');
    token && this.init(token, wx.hideLoading());
  },

  //初始化数据
  init(token, cb) {
    let that = this
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: app.baseURL + '/Adress/getAddress',
      data: {
        token: token,
        type: '1',
        page: "1",
        pagesize: "15",
        search: that.data.keyWord,
      
      },
      success: (res) => {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            that.setData({
              addressList: res.data.data.list,
              isNone: !res.data.data.list.length
            });
          } else if (res.data.code == 0) {
            wx.showModal({
              title: '温馨提示',
              content: res.data.msg,
            })
          }
          wx.hideLoading();
          typeof cb == 'function' && cb();
        }
      }
    })
  },

  //设置默认收货地址
  setDefault(e) {
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
  clickDeleteAddress(e) {
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
  selectAddress(e) {
    if(this.fromPlaceorder){
      //获取页面栈
      let pages = getCurrentPages();
      //获取上一个页面
      let prev = pages[pages.length - 2];
      //调用上一个页面的setData方法，从而达到naviagtreBack返回传参的效果
      //简单粗暴
      prev.setData({
        add_res: e.currentTarget.dataset.item //选中的地址数据
      });
      wx.navigateBack();
    }

  },
  // 搜索地址
  searchAddress(e) {
    const token = wx.getStorageSync('token');
    let keyWord = e.detail.value
    this.setData({
      keyWord
    })
    this.init(token, this.data.search)
  },

})