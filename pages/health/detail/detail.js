// pages/productdetail/index.js
const app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
var utils = require("../../../utils/util.js");
const https = require('../../../config/https')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin: true,
    goodsId: "", //商品id
    goodsData: "", //商品内容
    level: "", //等级
    currentNum: 1,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    activeIndex: 0,
    tab: ['图文详情', '发圈素材'],
    //评价类型进行切换
    commentTypeSelected: 0,

    // 产品参数显示隐藏
    productBox: true,
    //购物车弹窗显示隐藏
    cartBox: true,
    mask: true,
    //已选规格下标，默认选择第一种规格
    specActive: 0,

    specActiveed: 0,
    //已选规格价格
    specActivePrice: 0,
    //已选规格库存
    inventory: 0,
    goodsSpecId: "", //已选规格id
    //判断是购物车弹窗还是立即购买
    joinOrBuy: null,
    //选择弹窗判断是购物车弹窗还是立即购买
    optjoinOrBuy: null,
    otherId: "", //另一类规格id
    goodsNumber: "1", //选择数量
    allmarry: [], //所有的规格
    marry: [], //规格匹配
    nowmarry: 0, //没有此类搭配
    cart_num: "", //购物车数量
    height:"",
    isX:false, //判断是否为iphonX
  },

  // 到购物车
  clickToShopcart() {
    if (!this.data.hasLogin) {
      wx.showModal({
        title: '温馨提示',
        content: '请先登录',
        confirmText: "去登录",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../logintwo/index?type=1',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/shoppingcart/index',
      })
    }
  },
  // 轮播图切换
  change: function(e) {
    let current = e.detail.current + 1
    this.setData({
      currentNum: current
    })
  },

  //购物车弹窗---显示隐藏
  showCart(e) {
    if (!this.data.hasLogin) {
      wx.showModal({
        title: '温馨提示',
        content: '请先登录',
        confirmText: "去登录",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../logintwo/index?type=1',
            })
          }
        }
      })
      return
    }
    if (this.data.isBigHealth == 0) {
      wx.showToast({
        title: '该商品必须是大健康分销商才能下单！',
        icon: 'none'
      })
      return
    }
    this.setData({
      // hasUserInfo: true, //判断用户已登录，关闭授权窗口
      cartBox: !this.data.cartBox, //显示隐藏购物车弹窗
      mask: !this.data.mask, //显示隐藏遮罩层
      joinOrBuy: e.currentTarget.dataset.joinorbuy //判断是点击的加入购物车还是点击的立即购买
    });
  }, 
  //点击遮罩层隐藏弹窗
  hideAllBox() {
    this.setData({
      //遮罩层隐藏
      mask: true,
      //购物车弹窗隐藏
      cartBox: true,
      productBox: true
    })
  },
  //图文和评价---选项卡切换
  tabClick(e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },

  //商品评价类型---选项卡切换
  toMaterial(e) {
    let data = {
      shareDesc: this.data.goodsData.share_descr,
      shareContent: this.data.goodsData.share_content,
      shareImg: this.data.goodsData.share_images,
      image: this.data.goodsData.image,
      goods_id: this.data.goodsData.goods_id,
      my_img: this.data.goodsData.images
    }
    let metaril = JSON.stringify(data)
    wx.setStorageSync('metaril', metaril)
    wx.navigateTo({
      url: '../material/material',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      goodsId: options.goods_id,
      isBigHealth: options.isBigHealth || 0
    })
    this.init()
  },

  getStatus () {
    https.healthProxyStatus({
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 1) {
        let level = res.data[1]
        let proxyBg = res.data[2]
        console.log(proxyBg)
        this.setData({
          proxyBg
        })
        wx.setStorageSync('levelList', level)
        if (!res.data[0]) {
          this.setData({
            status: -1,
          })
        } else {
          this.setData({
            status: res.data[0].status
          })

        }
      }
    })
  },

  init() {
    let that = this
    wx.showLoading({
      title: '加载中...'
    });
    wx.request({
      url: app.baseURL + '/item/getItemDetail',
      data: {
        goods_id: that.options.goods_id,
        token:wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code == 1) {
          if (res.data.data.content != null) {
            //调用wxParse解析html文本
            WxParse.wxParse('goodsinfo', 'html', res.data.data.content, that, 5);
          }
          if (res.data.data.spec_type == 10) {
            that.setData({
              specActivePrice: res.data.data.goods_price,
              inventory: res.data.data.stock_nums
            })
          } else if (res.data.data.spec_type == 20) {
            res.data.data.item_sku.forEach(item => {
              if (item.sub) {
                item.sub.forEach(citem => {
                  citem.isHasSpec = false; // 选中的样式
                  citem.isCould = true; // true可以选的样式， false不可选的样式
                })
              }
            });
            that.setData({
              specActivePrice: res.data.data.goods_price,
              inventory: res.data.data.stock_nums
            })
          }
          // if (res.data.code) {
          //   clearInterval(this.countFun); //清除定时器避免重复
          //   this.countFun = setInterval(() => {
          //     data.time--;  //时间自减
          //     data.time < 0 && clearInterval(this.countFun);  // 时间到了清除定时器
          //     this.setData({ ['data.time']: utils.seckill(data.time) });
          //   }, 1000);
          // }
          // let inventory = 0;
          // res.data.list.forEach(item => {
          //   inventory += (item.inventory - 0);
          // })

          that.setData({
            goodsData: res.data.data
          })
          wx.hideLoading();
        } else if (res.data.code == 0) {
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          })
          wx.hideLoading();
          return
        }
        typeof cb == 'function' && cb();
      }
    })
  },

  //收藏商品
  onOffCollect(e) {
    if (!this.data.hasLogin) {
      wx.showModal({
        title: '温馨提示',
        content: '请先登录',
        confirmText: "去登录",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../logintwo/index?type=1',
            })
          }
        }
      })
    }else{
      if (this.data.isBigHealth == 0) {
        wx.showToast({
          title: '该商品必须是大健康分销商才能下单！',
          icon: 'none'
        })
      } else {
        this.collect(e);
      }
    }
  },


  // 产品参数
  showPro(){
    this.setData({
      mask: false,
      productBox: false
    })
  },


  //收藏
  collect(e) {
    console.log(e.currentTarget)
    const state = e.currentTarget.dataset.collect;
    const status = e.currentTarget.dataset.status;
    const token = wx.getStorageSync('token');
    const itemId = this.data.goodsData.goods_id;
    wx.showLoading({
      title: '加载中...'
    });
    wx.request({
      url: app.baseURL + '/collection/setCollect',
      data: {
        token: token,
        item_id: itemId,
        type: "1",
        status: status
      },
      success: (res) => {
        if (res.statusCode == 200) {
          //返回数据成功
          console.log(res)
          let data = res.data;
          if (res.data.code == 1) {
            wx.showToast({
              title: res.data.msg,
            })
            let goodsData = this.data.goodsData
            if (state == 0) {
              goodsData.is_collect = 1
            } else if (state == 1) {
              goodsData.is_collect = 0
            }
            this.setData({
              goodsData: goodsData
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '未登录',
              confirmText: '去登录',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../logintwo/index?type=1',
                  })
                }
              }
            })
          }
        }
        wx.hideLoading()
      }
    });
  },

  //购物车弹窗---选择商品多规格
  OneSelectSpec(e) {
    const data = e.currentTarget.dataset;
    console.log(e);
    this.setData({
      specActiveed: dataset.gui_id, //选中的规格id
      specActive: dataset.gui_id, //选中的规格id
      specItemIded: dataset.item_id, //选中的商品id
      specActivePrice: dataset.price, //选中的规格价格
      inventory: dataset.inventory, //选中的规格库存数
      limit: dataset.limit || null //选中的商品限购数量
    })
   
  },

  //购物车弹窗---选择商品多属性多规格
  selectSpec(e) {
    wx.showLoading({
      title: '请稍后...',
      duration: 0,
      mask:true,
    })
    this.setData({
      nowmarry: 0,
      allmarry: []
    })
    const that = this;
    const data1 = this.data;
    const dataset = e.currentTarget.dataset;
    let guige = null; //匹配的规格字符串

    // 根据选择的规格，判断另外的规格是否为空
    wx.request({
      url: app.baseURL + '/item/checkGoodsSpec?goods_id=' + data1.goodsData.goods_id + '&sku_id=' + dataset.gui_id,
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          if (res.data.data) {
            that.setData({
              otherId: res.data.data
            })
          } else {
            that.setData({
              [`goodsData.item_sku[${i}].sub[${dataset.index_x}].isCould`]: true
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        wx.hideLoading()
      }
    })

    this.data.marry.length = this.data.goodsData.item_sku.length;

    for (let i = 0; i < data1.goodsData.item_sku.length; i++) {
      if (dataset.index == i) {
        if (data1.goodsData.item_sku[dataset.index].sub[dataset.index_x].isHasSpec == true) {
          this.setData({
            [`goodsData.item_sku[${i}].sub[${dataset.index_x}].isHasSpec`]: false,
            nowmarry: 1
          })

          let now = this.data.marry.indexOf(dataset.item_id);
          this.data.marry.splice(now, 1, undefined);
        } else {
          this.data.marry.splice(dataset.index, 1, dataset.item_id);
          for (let j = 0; j < data1.goodsData.item_sku[i].sub.length; j++) {
            this.setData({
              [`goodsData.item_sku[${i}].sub[${j}].isHasSpec`]: false
            })
          }
          this.setData({
            [`goodsData.item_sku[${i}].sub[${dataset.index_x}].isHasSpec`]: true
          })
        }

      }
    }

    let marrydq = [];
    for (var v = 0; v < this.data.marry.length; v++) {
      console.log(v)
      var exist = typeof(this.data.marry[v]) == 'undefined';
      marrydq.push(exist);
    }
    guige = this.data.marry.join("_");
    console.log(guige);
    // console.log(this.data.marry);
    if (this.data.marry.length == data1.goodsData.item_sku.length && marrydq.indexOf(true) == -1) {

      wx.request({
        url: app.baseURL + '/item/getItemSku',
        data: {
          goods_id: data1.goodsData.goods_id,
          sku_id: guige
        },
        success(res) {
          if (res.data.code == 1) {
            that.setData({
              inventory: res.data.data.stock_num,
              goodsSpecId: res.data.data.goods_spec_id,
              specActivePrice: res.data.goods_price
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }
        }
      })
      // if (this.data.allmarry.indexOf(this.arrSort(guige.split("_"))) == -1) {
      // console.log(this.data.allmarry)
      // wx.showToast({
      //   title: '没有此搭配哦~',
      //   icon: 'none',
      // });
      // that.setData({
      //   nowmarry: 1
      // })
      // return;
      // } else {
      // this.data.allmarry.forEach((item, index) => {
      //   console.log(item)
      //   if (this.arrSort(guige.split("_")) == item) {
      //     that.setData({
      //       specActivePrice: data1.data.sub[index].price, //选中当前规格的价格
      //       inventory: data1.data.sub[index].inventory,   //选中当前规格的库存
      //       specActiveed: data1.data.sub[index].id,     //选中当前规格的id
      //       specItemIded: data1.data.sub[index].item_id,  //选中当前规格的item_id
      //     })
      //   }
      // })
      // }
    } else {
      that.setData({
        nowmarry: 1
      })
      return;
    }
  },
  //数组重新排序从小到大
  arrSort(arr) {
    return arr.sort((a, b) => {
      return a - b
    }).join("_");
  },

  //购物车弹窗---商品数量增加
  addNumber() {
    if (this.data.inventory <= this.data.goodsNumber) {
      wx.showToast({
        title: '不能超过库存数量',
        icon: 'none',
        mask: true
      })
      return false
    }
    this.setData({
      goodsNumber: ++this.data.goodsNumber
    })
  },
  //购物车弹窗---商品数量减少
  reduceNumber() {
    if (this.data.goodsNumber <= 1) return;
    this.setData({
      goodsNumber: --this.data.goodsNumber
    })
  },
  //购物车弹窗---通过手机按键改变商品数量时
  inputValueChange(e) {
    let val = e.detail.value;
    //当回删到空的时候，自动返回数量1
    if (val == '' || val <= 0) return 1;
    if (Number(val) > Number(this.data.inventory)) {
      wx.showToast({
        title: '不能超过库存数量',
        icon: 'none',
        mask: true
      })
      val = 1
    }
    this.setData({
      goodsNumber: val
    });
  },
  //购物车弹窗---点击确定按钮
  cartBoxClick(e) {
    let state = this.data.joinOrBuy,
      isSelect = this.data.goodsSpecId || this.data.goodsData.item_sku.goods_spec_id;
    console.log(this.data.goodsSpecId)
    console.log(this.data.goodsData.item_sku.goods_spec_id)
    // let optstate = e.currentTarget.dataset.joinorbuy;
    // nowmarry = this.data.nowmarry;

    // console.log(optstate);
    //先判断是否选中规格
    if (!isSelect) {
      wx.showToast({
        title: '请选择规格',
        icon: 'none'
      })
      return;
    }

    //加入购物车
    if (state === 'join') {
      if (this.data.inventory == 0) { //库存为0
        wx.showToast({
          title: '此规格没有库存了，看看其他的吧',
          icon: 'none'
        })
        return;
      }
      wx.showLoading({
        title: '加载中...',
      });
      wx.request({
        url: app.baseURL + '/item/addShopingCart',
        data: {
          goods_spec_id: isSelect,
          goods_id: this.data.goodsData.goods_id,
          num: this.data.goodsNumber,
          token: wx.getStorageSync('token'),
          type: this.data.goodsData.goods_type
        },
        success: (res) => {
          console.log(res)
          if (res.statusCode == 200) {
            if (res.data.code == 1) {
              this.getCartNum()
              this.init()
              this.setData({
                goodsSpecId: '',
                marry: []
              })
              wx.showToast({
                title: '宝贝在购物车等亲~',
                icon: 'none'
              });
              // this.setData({ dot: res.data.car_num });
              // app.setBadge(2, res.data.car_num);
              // wx.setStorageSync('car_num', res.data.car_num);
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              })
            }
            // wx.hideLoading();
           
          }
        },
         complete: function () {
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }
      });
      this.setData({
        cartBox: true, //隐藏购物车弹窗
        mask: true, //隐藏遮罩层
      });


    } //购买
    else if (state === 'buy') {
      if (!wx.getStorageSync('token')) {
        wx.showToast({
          title: '请登录后操作',
          icon: "none"
        })
        return
      }
      if (this.data.inventory == 0) { //库存为0
        wx.showToast({
          title: '此规格没有库存了，看看其他的吧',
          icon: 'none'
        })
        return;
      }
      //  options = this.data.optionsData,
      let gui_id = this.data.goodsSpecId || this.data.goodsData.item_sku.goods_spec_id, //规格id
        item_num = this.data.goodsNumber, //商品数量
        item_id = this.data.goodsData.goods_id, //商品id
        freight = this.data.goodsData.freight,
        token = wx.getStorageSync('token'), //用户id
        status = 2, //直接购买
        _type = this.data.goodsData.goods_type; //1普通商品，2限时 4大健康
      wx.navigateTo({
        url: '/pages/orderplace/index?type=' + 4 + '&gui_id=' + gui_id + '&item_num=' + item_num + '&item_id=' + item_id + '&token=' + token + '&freight=' + freight + '&status=' + status
      })
    } else {
      wx.showToast({
        title: '当前商品限购数量为' + this.data.limit,
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显
   * 示
   */
  onShow: function() {

    if (this.data.isBigHealth == 0) {
      this.getStatus()
    }
    this.getCartNum()
    if (!wx.getStorageSync('token')) {
      console.log(1);
      this.setData({
        hasLogin: false
      })
    }else{
      this.setData({
        hasLogin: true
      })
    }

    let that = this
    wx.request({
      url: app.baseURL + '/Mycenter/my_center?token=' + wx.getStorageSync('token'),
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            level: res.data.data.info.distributor
          })
        } else if (res.data.code == 0) {

        }
      }

    })
    wx.getSystemInfo({
      success: function(res) {
        if (res.model.search('iPhone X') != -1) {
          that.setData({
            isX:true
          })
        }
        that.setData({
          height: res.screenHeight+'rpx'
        })
      },
    })
  },

  getCartNum() {
    let that = this
    wx.request({
      url: app.baseURL + '/item/getGoodsNum?token=' + wx.getStorageSync('token'),
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            cart_num: res.data.data.cart_count
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      cartBox: true,
      mask: true
    })
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