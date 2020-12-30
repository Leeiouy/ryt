// pages/order/index.js
const app = getApp()
Page({
  data: {
    hasLogin:true, //判断登录
    activeIndex: 0, //当前选中的类型
    sliderOffset: 0, //滑块偏移距离
    sliderLeft: 0, //滑块初始left值
    sliderWidth: 67, //滑块初始width值
    orderList: [], //订单列表
    isNone: false, //false隐藏为空提示， true显示为空提示
    emptyTip: {
      font: "您暂时还没有订单哦~",
      imgUrl: "/images/none-order.png"
    },
    show: false,
    page_all:1,//全部
    page_sure:1,//确定
    page_send:1,//发货
    page_rese:1,//收货
    page_fini:1,//完成
    flag:true,
    imgList:[]
  },
  showPop(){
    this.setData({ show:true })
  },
  onClose(){
    this.setData({ show:false })
  },

  //点击预览
  previewImg: function (e) {
    let that = this
    let src = e.currentTarget.dataset.src;//获取data-src  循环单个图片链接
    let imgList = [e.currentTarget.dataset.src]
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  del(e){  //取消订单
    let order_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '温馨提示',
      content: '是否取消订单？',
      confirmColor: "#f00",
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.baseURL + '/order/setCancelOrder',
            data: {
              token: wx.getStorageSync('token'),
              order_id: order_id
            },
            success(res) {
              if (res.data.code == 1) {
                wx.redirectTo({
                  url: "/pages/orderSuccess/index?title=操作成功&tip=您已成功取消订单"
                })
              }
            }
          })
        }
      }
    })
  },
  onLoad: function (options) {
    // if (!app.globalData.userId) {
      // app.userLogin(() => this.init(options.jk));
    // } else {
    // }
    console.log(options.state);
    const activeIndex = options.type, //选中的下标
      query = wx.createSelectorQuery();  //创建节点选择器
    query.select('.navbar__item').boundingClientRect();
    query.exec((res) => {
      //res就是 该元素的信息 数组
      const width = res[0].width || this.data.sliderWidth;
      this.setData({
        activeIndex: activeIndex,
        sliderOffset: width * activeIndex,
        state: options.state
      })
    });
    this.init(options.state, this.data.page_all);
    // if (activeIndex == 0) {
    //   this.init(options.state, this.data.page_all)
    // } else if (activeIndex == 1) {
    //   this.init(options.state, this.data.page_sure)
    // } else if (activeIndex == 2) {
    //   this.init(options.state, this.data.page_send)
    // } else if (activeIndex == 3) {
    //   this.init(options.state, this.data.page_rese)
    // } else if (activeIndex == 4) {
    //   this.init(options.state, this.data.page_fini)
    // }
  },
  //切换类型
  tabClick: function (e) {
    console.log(e)
    const jk = e.currentTarget.dataset.jk,
      id = e.currentTarget.id,
      left = e.currentTarget.offsetLeft,
      oldLeft = this.options.type;
    if(this.data.activeIndex != id ){
      this.setData({
        orderList:[],
        flag:true,
        page_all:1,
        page_sure:1,
        page_send:1,
        page_rese:1,
        page_fini:1
      })
    }
    this.setData({
      //translateX的值就是终点目标距离左边的距离减去初始left的值
      sliderOffset: left,
      activeIndex: id,
    });
    if(this.data.activeIndex == 0){
      this.init(jk, this.data.page_all)
    }else if(this.data.activeIndex == 1){
      this.init(jk, this.data.page_sure)
    }else if(this.data.activeIndex == 2){
      this.init(jk, this.data.page_send)
    }else if(this.data.activeIndex == 3){
      this.init(jk, this.data.page_rese)
    }else if(this.data.activeIndex == 4){
      this.init(jk, this.data.page_fini)
    }
    
  },

  init(status,page){
    let that = this
    let token =wx.getStorageSync('token')
    let data={
      token:wx.getStorageSync('token'),
      order_status:status,
      page:page,
      pagesize:10,
      search: this.data.keyword ? this.data.keyword : '' 
    }
    wx.request({
      url: app.baseURL + '/order/getOrderLists',
      data:data,
      success(res){
        console.log(res)
        if(res.data.code==1){
          if(res.data.data.list.length > 0){
            let pages = page + 1
            let list = that.data.orderList
            for(let i = 0 ; i < res.data.data.list.length ; i++){
              list.push(res.data.data.list[i])
            }
            that.setData({
              orderList:list
            })
            if(that.data.activeIndex == 0){
              that.setData({
                page_all:pages
              })

            } else if (that.data.activeIndex == 1) {
              that.setData({
                page_sure: pages
              })

            } else if (that.data.activeIndex == 2) {
              that.setData({
                page_send: pages
              })

            } else if (that.data.activeIndex == 3) {
              that.setData({
                page_rese: pages
              })

            } else if (that.data.activeIndex == 4) {
              that.setData({
                page_fini: pages
              })

            }
          }else{
            that.setData({
              flag:false
            })
          }
          that.setData({
            // orderList:res.data.data.list,
            isNone: !that.data.orderList.length,
          })
        }
      }
    })
  },

  // 确认收货
  confirmReceipt(e) {
    let order_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '温馨提示',
      content: '是否确认收货？',
      confirmColor: "#f00",
      success: (res) => {
        if (res.confirm) {
          //加载中提示
          wx.showLoading({ title: '加载中' });
          //发送收货请求
          wx.request({
            url: app.baseURL + '/order/confirm_receipt',
            data: {
              token: wx.getStorageSync('token'),
              order_id: order_id
            },
            success: (res) => {
              if (res.statusCode == 200) {
                if (res.data.code == 1) {
                  wx.hideLoading();
                  //前往结果页面
                  wx.redirectTo({
                    url: "/pages/orderSuccess/index?title=操作成功&tip=您已成功收货"
                  })
                } else if (res.data.code == 0) {
                  //收货失败
                  wx.hideLoading();
                  wx.showToast({ title: res.data.msg, icon: 'none' })
                }
              }
            },
            fail: (res) => {
              wx.hideLoading();
              wx.showToast({ title: '网络错误', icon: 'none' })
            }
          })
        }
      }
    })
  },

  myInput (e) {
    let keyword = e.detail.value
    this.setData({
      keyword
    })
    this.search()
  },

  search () {
    this.setData({
      page: 1,
      flag: true
    })
    let that = this
    let keyword = this.data.keyword
    let page = this.data.page
    let data={
      token:wx.getStorageSync('token'),
      order_status:1,
      page:1,
      pagesize:3,
      search: keyword
    }
    wx.request({
      url: app.baseURL + '/order/getOrderLists',
      data:data,
      success(res){
        console.log(res)
        if(res.data.code==1){
          if(res.data.data.list.length > 0){
            let pages = page + 1
            let list = res.data.data.list
            
            that.setData({
              orderList:list
            })
            if(that.data.activeIndex == 0){
              that.setData({
                page_all:pages
              })

            } else if (that.data.activeIndex == 1) {
              that.setData({
                page_sure: pages
              })

            } else if (that.data.activeIndex == 2) {
              that.setData({
                page_send: pages
              })

            } else if (that.data.activeIndex == 3) {
              that.setData({
                page_rese: pages
              })

            } else if (that.data.activeIndex == 4) {
              that.setData({
                page_fini: pages
              })

            }
          }else{
            that.setData({
              flag:false
            })
          }
          that.setData({
            // orderList:res.data.data.list,
            isNone: !that.data.orderList.length,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(!wx.getStorageSync('token')){
      this.setData({
        hasLogin:false
      })
    }
    // this.init(1)
  },

  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    let that = this
    if (this.data.activeIndex == 0 && that.data.flag) {
      this.init(1, that.data.page_all)
    } else if (this.data.activeIndex == 1 && that.data.flag) {
      this.init(10, that.data.page_sure)
    } else if (this.data.activeIndex == 2 && that.data.flag) {
      this.init(20, that.data.page_send)
    } else if (this.data.activeIndex == 3 && that.data.flag) {
      this.init(30, that.data.page_rese)
    } else if (this.data.activeIndex == 4 && that.data.flag) {
      this.init(50, that.data.page_fini)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})