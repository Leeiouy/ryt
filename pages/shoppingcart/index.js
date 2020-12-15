// pages/shoppingcart/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: null, //购物车数据列表
    totalPrice: '0.00', //总价，初始0
    totalFreight: '0.00', //运费
    selectAllStates: true, //全选状态，默认全选
    isNone: false, //是否显示空购物车提示，false不显示，true显示
    totalNum:"",//总数
    isX:false,
    // hasUserInfo: true   //判断是否获取了用户数据  默认true为获取了
  },
  toDetail (e) {
    let type = e.currentTarget.dataset.type
    let goodId = e.currentTarget.dataset.id
    if (type == 4) {
      wx.navigateTo({
        url: '/pages/health/detail/detail?goods_id=' + goodId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/productdetail/index?goods_id=' + goodId,
      })
      
    }
  },

  //初始化数据
  init() {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '请稍等...',
      mask: true
    });
    wx.request({
      url: app.baseURL + '/item/getShopingCart',
      data: {
        token: wx.getStorageSync('token'),
        page: "1",
        pagesize: "15"
      },
      success: (res) => {
        if (res.data.code == 1) {
          let carts = res.data.data.list,
            total = 0, freight = 0;
          carts.forEach(item =>{
            item.selected = true
            if(item.expire == 0){
              total += item.goods_price * item.num
              freight += item.freight
            }
          })
          this.setData({
            carts: carts,
            isNone: !res.data.data.list.length,
            totalPrice:total,
            totalFreight: freight
          })
        }
        if (res.data.code == 0) {
          this.toast(res.data.msg)
          // wx.reLaunch({
          //   url: '../logintwo/index',
          // })
        }
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    })
  },

  //选中商品
  selectList(e) {
    let carts = this.data.carts, //商品列表
      selectAllStates = true; //全选状态,初始化一个全选的状态，然后遍历商品，如有未选中的则变更为未全选状态，并退出遍历
    //当前复选框下标    
    const index = e.currentTarget.dataset.index;
    //当前复选框选中、取消选中
    carts[index].selected = !carts[index].selected;
    //遍历商品列表，如果取消某选中某个商品，则全选的按钮也取消选中
    //如果所有复选框全部选中，则全选按钮也自动选中
    carts.forEach((item) => {
      console.log(item.selected)
      if (item.selected == false || !item.selected) {
        selectAllStates = false;
        return;
      }
    });
    // //更新数据   
    this.setData({
      carts: carts,
      selectAllStates: selectAllStates
    });
    // //更新价格总计
    this.getTotalPrice();
  },

  //选择全部
  selectAll() {
    let carts = this.data.carts,
      selectAllStates = !this.data.selectAllStates;
    //遍历商品列表，将每个商品的selected属性设置成true或者false实现全选或全不选    
    carts.forEach((item) => {
      item.selected = selectAllStates;
    });
    //更新数据    
    this.setData({
      selectAllStates: selectAllStates,
      carts: carts
    });
    //更新合计的钱数
    this.getTotalPrice();
  },

  //增加商品数量
  addCount(e) {
    let index = e.currentTarget.dataset.index; //carts
    let cartId = e.currentTarget.dataset.cart_id;
    let carts = this.data.carts; 
    console.log(carts)
     carts[index].num++;
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.baseURL + '/item/addShopingCartNums',
      data: {
        id: cartId,
        num: 1,
        token: wx.getStorageSync('token'),
        type: "1"
      },
      success: (res) => {
         console.log(res.data)
        wx.hideLoading();

        if (res.statusCode == 200) {
          //操作成功
          if (res.data.code == 1) {
            wx.hideLoading();
            carts[index].num = res.data.data.num
            //更新数据
            this.updateCarts(carts);
            //超出最大库存  
          } else if (res.data.code == 0) {
            carts[index].nums--;
            this.toast('不能超过该商品最大库存');
            //更新数据
            this.updateCarts(carts);
          }
        }
      },
      fail: (err) => {
        carts[index].nums--;
        this.toast('网络错误，请重试！');
        //更新数据
        this.updateCarts(carts);
      }
    })
    // //更新总价
    this.getTotalPrice();

  },

  //减少商品数量
  reduceCount(e){
    let index = e.currentTarget.dataset.index;
    let cartId = e.currentTarget.dataset.cart_id;
    let carts = this.data.carts;
    if (carts[index].num > 1) {
      carts[index].num--;
      wx.showLoading({
        title: '加载中'
      })
      //发送数量请求
      wx.request({
        url: app.baseURL + '/item/addShopingCartNums',
        data: {
          id: cartId,
          num: 1,
          token: wx.getStorageSync('token'),
          type: "2"
        },
        success: (res) => {
          if (res.statusCode == 200) {
            if (res.data.code == 1) {
              wx.hideLoading();
              carts[index].num = res.data.data.num
              //更新数据
              this.updateCarts(carts);
            }
          }
        },
        fail: (err) => {
          carts[index].nums++;
          this.toast('网络错误，请重试！');
          //更新数据
          this.updateCarts(carts);
        }
      });
      //更新总价
      this.getTotalPrice();
    }

  },

  //删除单个商品
  deleteGoods(e) {
    const index = e.currentTarget.dataset.index;
    const cartId = e.currentTarget.dataset.cart_id;
    let carts = this.data.carts;
    wx.showModal({
      title: '温馨提示',
      content: '确定删除当前商品吗？',
      confirmColor: "#f00",
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '加载中' });
          wx.request({
            url: app.baseURL + '/item/delShopingCart',
            data: {
              ids: cartId,
              token: wx.getStorageSync('token'),
            },
            success: (res) => {
              console.log(res.data)
              if (res.statusCode == 200) {
                if (res.data.code == 1) {
                  // //购物车商品数量，数字类型
                  // let num = res.data.car_num;
                  // //更新数据
                  carts.splice(index, 1);
                  this.updateCarts(carts);
                  // //更新总价
                  this.getTotalPrice();
                  wx.hideLoading();
                }
              }
            }
          });
        }
      }
    })
  },

  //结算
  toPlaceOrder() {
    let idArr = [];
    let typeArr = []
    let totalNum = this.data.totalNum
    this.data.carts.forEach((item) => {
      if (item.selected && item.expire == 0) {
        idArr.push(item.id)
        typeArr.push(item.type)
      };
    });
    if (!idArr.length) {
      this.toast('您还没选择宝贝哦');
      return
    };
    idArr = JSON.stringify(idArr);
    typeArr = JSON.stringify(typeArr);
    wx.navigateTo({
      url: '/pages/orderplace/index?status=1&idArr=' + idArr + '&typeArr=' + typeArr + '&totalNum=' + totalNum,
    });
  },
  //计算总价
  getTotalPrice() {
    let carts = this.data.carts,
      total = 0,
      totalNum = 0
    let totalFreight = 0     //运费
    //遍历计算总价    
    carts.forEach((item) => {
      if (item.selected && item.expire == 0){
        total += item.goods_price * item.num
        total += item.freight
        totalNum += item.num
        totalFreight += item.freight
      }
    });
    //更新价格数据
    this.setData({
      totalPrice: total.toFixed(2),
      totalNum: totalNum,
      totalFreight
    });
  },
  // 更新数据函数
  updateCarts(data) {
    this.setData({
      carts: data,
      isNone: !data.length
    })
  },

  //toast提示，默认没有图标
  toast(msg, ico) {
    wx.showToast({
      title: msg,
      icon: ico || 'none'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.init()
  let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)

        if (res.model.search('iPhone X') != -1) {
          that.setData({
            isX: true
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})