// pages/subcase/index.js
const https = require('../../config/https')
const app = getApp();
var utils = require("../../utils/util.js");
Page({
  data: {
    today: new Date(),
    hasLogin: true, //是否登录
    currentIndex: '', //切换交单
    showDialog: false,
    // currentIndex: '',
    isSearch: true, //显示搜索框
    selectAllStates: false, //全选状态，默认全选
    isShow: true, //是否显示空购物车提示，false显示，true不显示
    currentTime: "1", // 按时间搜索切换
    keyWord: "", //输入搜索
    now: "", //当天日期
    yers: "", //前一天日期
    before: "", //前天日期
    type: "0",
    status: "", //待审核已完成状态
    page: 1,
    pagesize: "100",
    pagesize_shen: '3',
    page_shen: 1, //审核页数
    page_shou: 1, //已收单页数
    level: "", //用户等级
    head: "", //用户头像
    waitOrder: [], //待交单数据
    auditOrder: [], //待审核订单
    acquiringOrder: [], //已收单订单
    waitTotal: "0.00", //所有订单总价
    waitNum: "0", //总订单的件数
    totalPrice: "0.00", //已选订单总价
    totalPriceShen: "0.00", //待审核应缴总价
    totalPriceShou: "0.00", //已收单应缴总价
    totalNum: "0", //已选订单数
    isNone: false,
    isNone_shen: false,
    isNone_shou: false,
    balance: "0", // 积分余额
    mobile: "", //手机号
    use: false,
    //为空提示
    emptyTip: {
      font: "暂无交单订单哦~",
      imgUrl: "/images/none-order.png"
    },
    bottom: 0, //iphonex
    isX: "", //iphonex
    day: '', //平台已收单的选择时间
    upday: '',
    show: true, //是否继续触底操作
    show_shou: true,
    flag: true,
    myCurrentIndex: 1
  },

  mySwitch(e) {
    let myCurrentIndex = e.currentTarget.dataset.index
    this.setData({
      myCurrentIndex,
      page: 1,
      waitOrder: [],
      auditOrder: [],
      acquiringOrder: []
    })

    if (myCurrentIndex == 1) {
      if (this.data.currentIndex == 0) {
        this.initWait(1)
      } else if (this.data.currentIndex == 1) {
        this.initAudit()
      } else {
        this.acquiring()
      }
    } else {
      if (this.data.currentIndex == 0) {
        this.initWaitHealth(1)
      } else if (this.data.currentIndex == 1) {
        this.initAuditHealth()
      } else {
        this.acquiringHealth()
      }
    }
  },

  selectDay(e) {
    this.setData({
      day: e.detail.value,
      upday: e.detail.value
    })
    if (this.data.myCurrentIndex == 1) {
      this.data.currentIndex == 1 ? this.initAudit() : this.acquiring()
    } else {
      this.data.currentIndex == 1 ? this.initAuditHealth() : this.acquiringHealth()
    }

  },
  tab(e) {
    let status = e.currentTarget.dataset.type
    this.setData({
      currentIndex: e.currentTarget.dataset.index,
      status: status,
      page: 1
    })
    if (this.data.myCurrentIndex == 1) {
      if (status == undefined) {
        this.initWait(1)
        return
      }
      this.data.currentIndex == 1 ? this.initAudit() : this.acquiring()
    } else {
      if (status == undefined) {
        this.initWaitHealth(1)
        return
      }
      this.data.currentIndex == 1 ? this.initAuditHealth() : this.acquiringHealth()
    }
  },

  //显示搜索框
  showSearch() {
    let isSearch = this.data.isSearch
    var animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'linear'
    })
    this.setData({
      isSearch: !isSearch
    })

  },

  // 搜索订单
  searchOrder(e) {
    let keyWord = e.detail.value
    this.setData({
      keyWord,
    })
    console.log(this.data.keyWord)
    if (this.data.myCurrentIndex == 1) {
      this.data.currentIndex == 1 ? this.initAudit() : this.acquiring()
    } else {
      this.data.currentIndex == 1 ? this.initAuditHealth() : this.acquiringHealth()
    }
  },

  // 删除
  deleteGoods(e) {
    let id = e.currentTarget.dataset.id
    let waitOrder = this.data.waitOrder,
      index = e.currentTarget.dataset.index
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/order/setDelOrder',
      data: {
        token: wx.getStorageSync('token'),
        order_id: id
      },
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          waitOrder.splice(index, 1)
          that.setData({
            waitOrder: waitOrder,
            isNone: !waitOrder.length
          })
          //更新价格总计
          that.getTotalPrice();
          wx.showToast({
            title: res.data.msg,
          })
        }
        wx.hideLoading()
      }
    })
  },

  // 待交单详情
  toOrderWait() {
    wx.navigateTo({
      url: '../subcasewaite/index',
    })
  },
  // 审核订单详情
  toOrderDetail(e) {
    wx.navigateTo({
      url: '../waitdetail/index',
    })
  },
  //选中商品
  selectList(e) {
    let waitOrder = this.data.waitOrder, //商品列表
      selectAllStates = true; //全选状态,初始化一个全选的状态，然后遍历商品，如有未选中的则变更为未全选状态，并退出遍历
    //当前复选框下标    
    const index = e.currentTarget.dataset.index;
    //当前复选框选中、取消选中
    waitOrder[index].selected = !waitOrder[index].selected;
    //遍历商品列表，如果取消某选中某个商品，则全选的按钮也取消选中
    //如果所有复选框全部选中，则全选按钮也自动选中
    waitOrder.forEach((item) => {
      console.log(item.selected)
      if (item.selected == false || !item.selected) {
        selectAllStates = false;
        return;
      }
    });
    //更新数据   
    this.setData({
      waitOrder: waitOrder,
      selectAllStates: selectAllStates
    });
    //更新价格总计
    this.getTotalPrice();
  },
  //选择全部
  selectAll() {
    let waitOrder = this.data.waitOrder,
      selectAllStates = !this.data.selectAllStates;
    //遍历商品列表，将每个商品的selected属性设置成true或者false实现全选或全不选    
    waitOrder.forEach((item) => {
      item.selected = selectAllStates;
    });
    //更新数据    
    this.setData({
      selectAllStates: selectAllStates,
      waitOrder: waitOrder
    });
    //更新合计的钱数
    this.getTotalPrice();
  },


  //计算总价
  getTotalPrice() {
    let waitOrder = this.data.waitOrder,
      total = 0,
      num = 0
    //遍历计算总价    
    waitOrder.forEach((item) => {
      if (item.selected) {
        total += item.ordergood_info.price * item.ordergood_info.total_num;
        item.orderNum = 1
        num += item.orderNum
        if (item.freight) {
          total += Number(total) + Number(item.freight)
        }
      }
    });
    //更新价格数据
    this.setData({
      totalPrice: total.toFixed(2),
      totalNum: num,
    });
  },

  // 确认交单
  toPlaceOrder(e) {
    let orderWait = this.data.waitOrder
    this.setData({
      flag: true
    })
    orderWait.forEach(item => {
      if (!item.selected) {
        return
      } else {
        this.setData({
          isShow: false
        })
      }
    })
  },
  // 取消交单
  cancel(e) {
    this.setData({
      isShow: true
    })
  },
  // 关闭确认交单弹窗
  closeDialog(e) {
    this.setData({
      isShow: true
    })
  },
  //使用积分
  useInteral(e) {
    let use = this.data.use
    let balance = e.currentTarget.dataset.balance
    this.setData({
      use: !use,
    })
  },
  // 确认交单
  formsubmit(e) {
    let that = this
    if (that.data.flag) {
      that.setData({
        flag: false
      })
      let waitOrder = this.data.waitOrder
      let totalPrice = this.data.totalPrice
      let balance = this.data.balance //可用积分
      let type = this.data.currentTime
      let order_id = []
      waitOrder.forEach(item => {
        if (item.selected) {
          order_id.push(item.id)
        }
      })
      if (that.data.use) {
        totalPrice = totalPrice - balance
      }
      if (this.data.myCurrentIndex == 1) {
        wx.request({
          url: app.baseURL + '/order/confirm_submit',
          data: {
            token: wx.getStorageSync('token'),
            order_ids: order_id.join(','),
            total_price: that.data.totalPrice,
            remark: e.detail.value.remark,
            use_integral: that.data.use ? '1' : ''
          },
          success(res) {
            if (res.data.code == 1) {
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    that.initWait(that.data.currentTime)
                  }
                }
              })
              that.setData({
                isShow: true
              })
            } else if (res.data.code == 0) {
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              })
            }
          }
        })
      } else {
        https.healthFormsubmitS({
          token: wx.getStorageSync('token'),
          order_ids: order_id.join(','),
          total_price: that.data.totalPrice,
          remark: e.detail.value.remark,
          use_integral: that.data.use ? '1' : ''
        }).then(res => {
          console.log(res)
          if (res.code == 1) {
            wx.showModal({
              title: '提示',
              content: res.msg,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  that.initWaitHealth(that.data.currentTime)
                }
              }
            })
            that.setData({
              isShow: true
            })
          } else if (res.code == 0) {
            wx.showToast({
              title: res.msg,
              icon: "none"
            })
          }
        })
      }

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },
  getDay(t) {
    let d = new Date()
    var year = d.getFullYear()
    let day = new Date() - (24 * t) * 60 * 60 * 1000,
      forMatDay = utils.formatTime(day, 'hms'),
      today = year + '-' + forMatDay.split('-')[1] + '-' + forMatDay.split('-')[2]
    if (t == 0) {
      this.setData({
        now: today,
        day: today
      })
      return
    }
    if (t == 1) {
      this.setData({
        yers: today
      })
      return
    }
    if (t == 2) {
      this.setData({
        before: today
      })
      return
    }
  },

  // 按时间搜索
  timeSearch(e) {
    let type = e.currentTarget.dataset.time
    this.setData({
      type: type,
      currentTime: type
    })
    if (this.data.myCurrentIndex == 1) {
      if (this.data.currentIndex == 0) {
        this.initWait(type)
        return
      }
      this.initAudit()
    } else {
      if (this.data.currentIndex == 0) {
        this.initWaitHealth(type)
        return
      }
      this.initAuditHealth()
    }
  },

  // 待交单数据
  initWait(type) {
    let that = this
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.baseURL + '/order/wait_submit',
      data: {
        token: token,
        type: type,
        page: that.data.page,
        pagesize: that.data.pagesize
      },
      success(res) {
        if (res.data.code == 1) {
          // console.log(res.data.data.list)
          let waitOrder = res.data.data.list,
            total = 0
          waitOrder.forEach(item => {
            item.selected = false
            if (item.ordergood_info) {
              total += item.ordergood_info.price * item.ordergood_info.total_num;
              let mobile = item.user_info.mobile
              that.setData({
                mobile: mobile,
              })
            }
          })
          that.setData({
            waitTotal: res.data.data.count.total_price,
            waitNum: res.data.data.count.goods_num,
            // waitTotal: total.toFixed(2),
            waitOrder: waitOrder,
            isNone: !waitOrder.length
          });
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
        wx.hideLoading()
      },
      fail(err) {
        wx.showToast({
          title: '网络错误',
          icon: "none"
        })
      }
    })
  },

  // 大健康 待交单数据
  initWaitHealth(type) {
    let that = this
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    https.healthWaitS({
      token: token,
      type: type,
      page: that.data.page,
      pagesize: that.data.pagesize
    }).then(res => {
      if (res.code == 1) {
        let waitOrder = res.data.list,
          total = 0
        waitOrder.forEach(item => {
          item.selected = false
          if (item.ordergood_info) {
            total += item.ordergood_info.price * item.ordergood_info.total_num;
            let mobile = item.user_info.mobile
            that.setData({
              mobile: mobile,
            })
          }
        })
        that.setData({
          waitTotal: res.data.count.total_price,
          waitNum: res.data.count.goods_num,
          // waitTotal: total.toFixed(2),
          waitOrder: waitOrder,
          isNone: !waitOrder.length
        });
      } else if (res.code == 0 && wx.getStorageSync('token')) {
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
      wx.hideLoading()
    }, err => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
    })
  },

  // 待审核
  initAudit() {
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      status: 1,
      type: that.data.type,
      search: that.data.keyWord,
      page: (that.data.upday || that.data.keyWord) ? 1 : that.data.page_shen,
      pagesize: (that.data.upday || that.data.keyWord) ? 30 : 3,
      day: that.data.upday ? that.data.upday : ''
    }
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/order/approval_result',
      data: data,
      success(res) {

        res.data.data.list.forEach(item => {
          item.createtime = utils.formatTime(item.createtime * 1000);
        })

        if (res.data.code == 1) {
          if (that.data.upday || that.data.keyWord) {
            that.setData({
              auditOrder: res.data.data.list
            })

          } else {
            if (res.data.data.list.length > 0) {
              let order_list = that.data.auditOrder
              let page_shen = that.data.page_shen + 1
              for (let i = 0; i < res.data.data.list.length; i++) {
                order_list.push(res.data.data.list[i])
              }
              that.setData({
                auditOrder: order_list,
                page_shen: page_shen
              })

            } else {
              that.setData({
                show: false,
                page_shen: 1
              })
            }

          }
          that.setData({
            // auditOrder: res.data.data.list,
            isNone_shen: !that.data.auditOrder.length,
            auditTotal: res.data.data.count
          })
        }
        wx.hideLoading()
      }
    })
  },

  // 大健康 交单待审核
  initAuditHealth() {
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      status: 1,
      type: that.data.type,
      search: that.data.keyWord,
      page: (that.data.upday || that.data.keyWord) ? 1 : that.data.page_shen,
      pagesize: (that.data.upday || that.data.keyWord) ? 30 : 3,
      day: that.data.upday ? that.data.upday : ''
    }
    wx.showLoading({
      title: '加载中...',
    })
    https.healthAuditStatusS(data).then(res => {
      console.log(res)
      res.data.list.forEach(item => {
        item.createtime = utils.formatTime(item.createtime * 1000);
      })

      if (res.code == 1) {
        if (that.data.upday || that.data.keyWord) {
          that.setData({
            auditOrder: res.data.list
          })

        } else {
          if (res.data.list.length > 0) {
            let order_list = that.data.auditOrder
            let page_shen = that.data.page_shen + 1
            for (let i = 0; i < res.data.list.length; i++) {
              order_list.push(res.data.list[i])
            }
            that.setData({
              auditOrder: order_list,
              page_shen: page_shen
            })

          } else {
            that.setData({
              show: false,
              page_shen: 1
            })
          }

        }
        that.setData({
          // auditOrder: res.data.list,
          isNone_shen: !that.data.auditOrder.length,
          auditTotal: res.data.count
        })
      }
      wx.hideLoading()
    })
  },


  //已收单数据
  acquiring() {
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      status: 2,
      // type: 1,
      search: that.data.keyWord,
      page: (that.data.upday || that.data.keyWord) ? 1 : that.data.page_shou,
      pagesize: (that.data.upday || that.data.keyWord) ? 30 : 3,
      day: this.data.upday ? this.data.upday : ''
    }
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/order/approval_result',
      data: data,
      success(res) {

        res.data.data.list.forEach(item => {
          item.createtime = utils.formatTime(item.createtime * 1000);
        })

        if (res.data.code == 1) {
          if (that.data.upday || that.data.keyWord) {
            that.setData({
              acquiringOrder: res.data.data.list
            })
          } else {
            if (res.data.data.list.length > 0) {
              let shou_list = that.data.acquiringOrder
              let page_shou = that.data.page_shou + 1
              for (let i = 0; i < res.data.data.list.length; i++) {
                shou_list.push(res.data.data.list[i])
              }
              that.setData({
                acquiringOrder: shou_list,
                page_shou: page_shou
              })

            } else {
              that.setData({
                show_shou: false,
                page_shou: 1
              })
            }
          }
          that.setData({
            // auditOrder: res.data.data.list,
            isNone_shou: !that.data.acquiringOrder.length,
            auditTotal_shou: res.data.data.count
          })
        }
        wx.hideLoading()
      }
    })
  },

  // 大健康 已收单数据
  acquiringHealth() {
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      status: 2,
      // type: 1,
      search: that.data.keyWord,
      page: (that.data.upday || that.data.keyWord) ? 1 : that.data.page_shou,
      pagesize: (that.data.upday || that.data.keyWord) ? 30 : 3,
      day: this.data.upday ? this.data.upday : ''
    }
    wx.showLoading({
      title: '加载中...',
    })
    https.healthAuditStatusS(data).then(res => {
      res.data.list.forEach(item => {
        item.createtime = utils.formatTime(item.createtime * 1000);
      })

      if (res.code == 1) {
        if (that.data.upday || that.data.keyWord) {
          that.setData({
            acquiringOrder: res.data.list
          })
        } else {
          if (res.data.list.length > 0) {
            let shou_list = that.data.acquiringOrder
            let page_shou = that.data.page_shou + 1
            for (let i = 0; i < res.data.list.length; i++) {
              shou_list.push(res.data.list[i])
            }
            that.setData({
              acquiringOrder: shou_list,
              page_shou: page_shou
            })

          } else {
            that.setData({
              show_shou: false,
              page_shou: 1
            })
          }
        }
        that.setData({
          // auditOrder: res.data.list,
          isNone_shou: !that.data.acquiringOrder.length,
          auditTotal_shou: res.data.count
        })
      }
      wx.hideLoading()
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // this.initWait(1);
    console.log(wx.getStorageSync('token'))
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
      this.getDay(0)
      this.getDay(1)
      this.getDay(2)
      this.setData({
        page_shen: 1,
        page_shou: 1,
        auditOrder: [],
        acquiringOrder: [],
        show: true,
        show_shou: true,
        myCurrentIndex: 1,
        currentIndex: 0
      })
      this.initWait(1);
      // this.initAudit();
      // this.acquiring();
      let that = this
      wx.getSystemInfo({
        success: function (res) {
          console.log(res)
          if (res.model.search('iPhone X') != -1) {
            that.setData({
              bottom: 68,
              isX: true
            })
          }
          if (res.model.search('iPhone 11') != -1) {
            that.setData({
              bottom: res.statusBarHeight,
              isX: true
            })
            console.log((res.screenWidth) / 750)
          }
          console.log(that.data.bottom)
        },
      })
      // that.setData({
      //   currentIndex: '0'
      // })
      wx.request({
        url: app.baseURL + '/distribution/center?token=' + wx.getStorageSync('token'),
        success(res) {
          if (res.data.code == 1) {
            that.setData({
              balance: res.data.data.info.balance,
              distributor: res.data.data.info.distributor,
              level: Number(res.data.data.info.level),
              head: res.data.data.info.avatar,
            })
          }
        }
      })
    }


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      currentTime: 1,
      selectAllStates: false,
      totalPrice: "0.00", //已选订单总价
      totalNum: "0", //已选订单数
    })
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

    wx.showLoading({
      title: '请稍后',
    })
    if (this.data.myCurrentIndex == 1) {
      if (this.data.status) {
        this.data.currentIndex == 1 ? this.initAudit() : this.acquiring()
      } else {
        this.initWait();
      }
    } else {
      if (this.data.status) {
        this.data.currentIndex == 1 ? this.initAuditHealth() : this.acquiringHealth()
      } else {
        this.initWaitHealth();
      }
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    if(this.data.myCurrentIndex == 1) {
      if (that.data.show && that.data.currentIndex == 1) {
        that.initAudit();
      } else if (that.data.show_shou && that.data.currentIndex == 2) {
        that.acquiring();
      }
    } else {
      if (that.data.show && that.data.currentIndex == 1) {
        that.initAuditHealth();
      } else if (that.data.show_shou && that.data.currentIndex == 2) {
        that.acquiringHealth();
      }
    }

    // if (that.data.waitOrder.length )

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})