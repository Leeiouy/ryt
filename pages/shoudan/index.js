const app = getApp();
var utils = require("../../utils/util.js");
const https = require('../../config/https')
Page({
  data: {
    userLevel: '', // 用户等级
    hasLogin: true, //是否登录
    currentIndex: '0', //切换交单
    showDialog: false,
    isSearch: true, //显示搜索框
    selectAllStates: false, //全选状态，默认全选
    isShow: true, //是否显示空购物车提示，false显示，true不显示
    currentTime: "1", // 按时间搜索切换
    keyWord: "", //输入搜索
    now: "", //当天日期
    yers: "", //前一天日期
    before: "", //前天日期
    type: "0", //日期状态
    status: "", // 待审核/已完成状态
    page: "1",
    page_shen: 1, //审核页数
    page_shou: 1, //已收单页数
    pagesize: "100",
    level: "", //下级等级
    head: "", //下级头像
    moblile: "",
    waitOrder: [], //待交单数据
    auditOrder: [], //待审核订单
    acquiringOrder: [], //已审核数据
    waitTotal: "0.00", //所有订单总价
    totalPrice: "0.00", //已选订单总价
    totalPriceDel: "0.00", //已选订单中取消的总价
    totalPriceShen: "0.00", //待审核合计应缴
    totalPriceShou: "0.00", // 已收单合计应缴
    totalNum: "0", //已选订单数
    totalNumDel: "0", //已选订单中已取消的订单数
    isNone: false,
    isNone_shen: false,
    isNone_shou: false,
    balance: "0", // 积分余额
    use: false,
    //为空提示
    emptyTip: {
      font: "暂无交单订单哦~",
      imgUrl: "/images/none-order.png"
    },
    bottom: "", // iphonex/iphone11
    isX: "", //iphonex
    day: '', //平台已收单的选择时间
    upday: '',
    goods_num: 0, //商品数量
    show: true, //是否继续触底操作
    show_shou: true,
    auditTotal_shou: '',
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

  sign(e) { //确认收款
    const that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      content: '是否确认收款',
      confirmColor: '#E4592A',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.baseURL + '/order/markedPayment',
            data: {
              token: wx.getStorageSync('token'),
              id: id
            },
            success(res) {
              that.initWait(1)
            }
          })
        }
      }
    })
  },
  // 选择日期
  selectDay(e) {
    this.setData({
      day: e.detail.value,
      upday: e.detail.value
    })
    if(this.data.myCurrentIndex == 1) {
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
      keyWord
    })
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      if(this.data.myCurrentIndex == 1) {
        if (this.data.status == undefined || !this.data.status) {
          this.initWait(this.data.currentTime)
        } else {
          this.data.currentIndex == 1 ? this.initAudit() : this.acquiring()
        }
      } else {
        if (this.data.status == undefined || !this.data.status) {
          this.initWaitHealth(this.data.currentTime)
        } else {
          this.data.currentIndex == 1 ? this.initAuditHealth() : this.acquiringHealth()
        }
      }
    }, 500)
  },

  // 待交单详情
  toOrderWait() {
    wx.navigateTo({
      url: '../subcasewaite/index',
    })
  },
  // 审核订单详情
  toOrderDetail(e) {
    // if (this.data.currentIndex == 1){
    //   wx.navigateTo({
    //     url: '../waitdetail/index?id=' + e.currentTarget.dataset.wait,
    //   })
    // }else{
    wx.navigateTo({
      url: '../waitdetail/index?id=' + e.currentTarget.dataset.finish,
    })
    // }
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
      totalDel = 0,
      numDel = 0,
      num = 0
    //遍历计算总价    
    waitOrder.forEach((item) => {
      if (item.selected) {
        if (this.data.userLevel == 3 && item.second_total_price > 0) {
          total += item.second_total_price * 1;
          totalDel += item.second_cancell_price * 1;
          // total += item.second_total_price * item.total_num;
          item.orderNum = 1
          // item.cancel_num = 1
          num += item.orderNum
          numDel += item.cancel_num
        } else {
          total += item.first_total_price * 1;
          totalDel += item.first_cancel_price * 1;
          // total += item.first_total_price * item.total_num;
          item.orderNum = 1
          // item.cancel_num = 1
          num += item.orderNum
          numDel += item.cancel_num
        }
      }
    });
    //更新价格数据
    this.setData({
      totalPrice: total.toFixed(2),
      totalNum: num,
      totalPriceDel: totalDel.toFixed(2),
      totalNumDel: numDel,
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

  // 确认交单
  formsubmit(e) {
    let that = this
    if (that.data.flag) {
      that.setData({
        flag: false
      })
      let orderWait = that.data.waitOrder
      orderWait.forEach(item => {
        if (!item.selected) {
          return
        }
      })
      let order_id = []
      orderWait.forEach(item => {
        if (item.selected) {
          order_id.push(item.id)
        }
      })
      if (this.data.myCurrentIndex == 1) {
        wx.request({
          url: app.baseURL + '/order/onekey_submit',
          data: {
            token: wx.getStorageSync('token'),
            ids: order_id.join(','),
            use_integral: that.data.use == true ? '1' : ''
          },
          success(res) {
            console.log(res)
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
        https.healthFormsubmit({
          token: wx.getStorageSync('token'),
          ids: order_id.join(','),
          use_integral: that.data.use == true ? '1' : ''
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let that = this
    // that.setData({
    //   page_shen:1,
    //   page_shou:1,
    //   auditOrder:[],
    //   acquiringOrder:[],
    //   show:true,
    //   show_shou:true,
    //   upday:''
    // })
    // that.initWait(1),
    // that.initAudit(),
    // that.acquiring()


  },
  getDay(t) {
    let d = new Date()
    var year = d.getFullYear()
    console.log(year)
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

  // 待收单数据
  initWait(type) {
    let that = this
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.baseURL + '/order/summit_them',
      data: {
        token: token,

        type: type,
        page: that.data.page,
        pagesize: that.data.pagesize
      },
      success(res) {
        if (res.data.code == 1) {
          let waitOrder = res.data.data.list,
            total = 0
          waitOrder.forEach(item => {
            item.selected = false
            item.createtime = utils.formatTime(item.createtime * 1000);
            total += item.receivables * 1;
            // total += item.total_price * item.total_num;
            that.setData({
              head: item.user_info.avatar,
              level: item.user_info.level,
              moblile: item.user_info.mobile,
            })
          })
          that.setData({
            waitTotal: total.toFixed(2),
            waitOrder: waitOrder,
            goods_num: res.data.data.count.goods_num,
            isNone: !waitOrder.length
          });
        } else if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
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

  // 大健康收单数据
  initWaitHealth(type) {
    let that = this
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })

    https.healthWait({
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
          item.createtime = utils.formatTime(item.createtime * 1000);
          total += item.receivables * 1;
          // total += item.total_price * item.total_num;
          that.setData({
            head: item.user_info.avatar,
            level: item.user_info.level,
            moblile: item.user_info.mobile,
          })
        })
        that.setData({
          waitTotal: total.toFixed(2),
          waitOrder: waitOrder,
          goods_num: res.data.count.goods_num,
          isNone: !waitOrder.length
        });
      } else if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
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
      type: this.data.currentTime,
      search: that.data.keyWord,
      page: (that.data.keyWord || that.data.upday) ? 1 : that.data.page_shen,
      pagesize: (that.data.keyWord || that.data.upday) ? 30 : 3,
      day: this.data.upday ? this.data.upday : ''
    }
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/order/audit_results',
      data: data,
      success(res) {
        // if (res.data.code == 1) {
        //   let auditOrder = res.data.data.list;
        //   auditOrder.forEach(item => {
        //     item.createtime = utils.formatTime(item.createtime * 1000); 
        //   })
        //   that.setData({
        //     auditOrder: res.data.data.list,
        //     isNone: !res.data.data.list.length,
        //     auditTotal: res.data.data.count
        //   })
        // }
        // wx.hideLoading()

        res.data.data.list.forEach(item => {
          item.createtime = utils.formatTime(item.createtime * 1000);
        })

        if (res.data.code == 1) {
          if (that.data.keyWord || that.data.upday) {
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

  // 大健康 收单待审核
  initAuditHealth() {
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      status: 1,
      type: this.data.currentTime,
      search: that.data.keyWord,
      page: (that.data.keyWord || that.data.upday) ? 1 : that.data.page_shen,
      pagesize: (that.data.keyWord || that.data.upday) ? 30 : 3,
      day: this.data.upday ? this.data.upday : ''
    }
    wx.showLoading({
      title: '加载中...',
    })
    https.healthAuditStatus(data).then(res => {
      res.data.list.forEach(item => {
        item.createtime = utils.formatTime(item.createtime * 1000);
      })

      if (res.code == 1) {
        if (that.data.keyWord || that.data.upday) {
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

  // 已审核数据
  acquiring() {
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      status: 2,
      type: 0,
      search: that.data.keyWord,
      page: (that.data.keyWord || that.data.upday) ? 1 : that.data.page_shou,
      pagesize: (that.data.keyWord || that.data.upday) ? 30 : 3,
      day: this.data.upday ? this.data.upday : ''
    }
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.baseURL + '/order/audit_results',
      data: data,
      success(res) {
        // if (res.data.code == 1) {
        //   let auditOrder = res.data.data.list;
        //   auditOrder.forEach(item => {
        //     item.createtime = utils.formatTime(item.createtime * 1000);
        //   })
        //   that.setData({
        //     auditOrder: res.data.data.list,
        //     isNone: !res.data.data.list.length,
        //     auditTotal: res.data.data.count
        //   })
        // }
        // wx.hideLoading()
        res.data.data.list.forEach(item => {
          item.createtime = utils.formatTime(item.createtime * 1000);
        })

        if (res.data.code == 1) {
          if (that.data.keyWord || that.data.upday) {
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

  // 大健康收单 已审核数据
  acquiringHealth() {
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      status: 2,
      type: 0,
      search: that.data.keyWord,
      page: (that.data.keyWord || that.data.upday) ? 1 : that.data.page_shou,
      pagesize: (that.data.keyWord || that.data.upday) ? 30 : 3,
      day: this.data.upday ? this.data.upday : ''
    }
    wx.showLoading({
      title: '加载中...',
    })
    https.healthAuditStatus(data).then(res => {
      res.data.list.forEach(item => {
        item.createtime = utils.formatTime(item.createtime * 1000);
      })

      if (res.code == 1) {
        if (that.data.keyWord || that.data.upday) {
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


  onShow: function () {
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
      upday: '',
      myCurrentIndex: 1,
      currentIndex: 0
    })
    console.log(this.data.page_shen)

    this.initWait(1);
    // this.initAudit();
    // this.acquiring();
    // this.initWait(1)

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

      }
    })

    wx.request({
      url: app.baseURL + '/distribution/center?token=' + wx.getStorageSync('token'),
      success(res) {
        if (res.data.code == 1) {
          that.setData({
            balance: res.data.data.info.balance,
            distributor: res.data.data.info.distributor
            // level: res.data.data.info.level,
            // head: res.data.data.info.avatar,
          })
        }
      }
    })
    that.setData({
      userLevel: app.globalData.level
    })
    if (!wx.getStorageSync('token')) {
      that.setData({
        hasLogin: false
      })
      wx.reLaunch({
        url: '../logintwo/index',
      })
      return
    }

  },
  onHide: function () {
    this.setData({
      currentTime: 1,
      selectAllStates: false,
      totalPrice: "0.00", //已选订单总价
      totalNum: "0", //已选订单数
      totalNumDel: '0',
      totalPriceDel: '0',
    })
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
  },

})