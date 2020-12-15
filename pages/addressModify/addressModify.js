const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null, //收货地址信息
    isDefault: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.item))
    let info = JSON.parse(options.item)
    this.setData({
      info:info,
      shperson: info.name,
      mobile: info.phone,
      region: info.province + ',' + info.city + ',' + info.region,
      detail_info: info.detail,
      status: info.isdefault,
    })
    console.log(info.province + ',' + info.city + ',' + info.region)
  },

  //选择收货地址省市区
  regionChange(e) {
    this.setData({ region: e.detail.value.join(',') });
    console.log(this.data.region)
  },

  //默认收货地址不可取消的提示
  // switchChange() {
  //   wx.showToast({
  //     title: '默认收货地址不可以取消！',
  //     icon: 'none'
  //   })
  // },

  //提交数据
  formSubmit: function (e) {
    console.log(e)
    const reg = /^1[23456789]\d{9}$/;
    const regs = /^0791\d{8}$/;
    console.log(this.data.region)
    let address = this.data.region
    let province = address.split(',')[0]
    console.log(address)
    console.log(province)
    let city = address.split(',')[1]
    let region = address.split(',')[2]
    //需要提交的数据
    let data = {
      token : wx.getStorageSync('token'), //用户id
      address_id: this.data.info.address_id,//地址id
      name: e.detail.value.username, //收货人姓名
      phone: e.detail.value.mobile, //收货人手机号
      province: province,
      city: city,
      region: region,
      detail: e.detail.value.detail, //详细地址
      isdefault: e.detail.value.default - 0 //是否默认，布尔值转换成数字
    }
    //进行验证判断
    if (!data.name) { this.toast('请输入收货人'); return; }
    if (!data.phone) { this.toast('请输入联系电话'); return; }
    if (!(reg.test(data.phone) || regs.test(data.phone))) { this.toast('手机号格式不正确'); return; }
    if (!this.data.region) { this.toast('请选择省市区'); return; }
    if (!data.detail) { this.toast('请输入详细地址'); return; }
    //发送请求
    wx.request({
      url: app.baseURL + '/Adress/updateAddress',
      data: data,
      success: (res) => {
        console.log(res)
        if (res.data.code == 1) {
          wx.showToast({ title: '修改成功', icon: 'none' });
          wx.navigateBack();
        }
      }
    })
  },

  //简化提示函数
  toast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})