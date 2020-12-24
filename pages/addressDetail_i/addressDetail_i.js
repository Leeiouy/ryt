import _areaList from '../../config/area';

import {
  _addressAdd,
  _addressChange,
  _addressRemove
} from '../../config/https'
const app = getApp();

Page({
  data: {
    name: '', //收货人
    phone: '', //手机号
    address: '', //地区
    addressDetail: '', //地区详情
    isDefault: false, //是否为默认地址


    //------------------选择地区相关------------------------
    areaList: _areaList, //地区列表数据 本地的
    areaShow: false, //是否展示地区选择弹出层



    //------------------上个页面带过来的地址数据------------------------
    pageInfo: null

  },
  onLoad: function (options) {
    let info = options.info && JSON.parse(options.info)
    if (info) {
      wx.setNavigationBarTitle({
        title: '编辑地址'
      });
      this.setData({
        pageInfo: info,
        name: info.name,
        phone: info.phone,
        address: info.province + '-' + info.city + '-' + info.region,
        addressDetail: info.detail,
        isDefault: Number(info.isdefault) ? true : false
      })
    }

  },
  //----------------输入框事件----------------
  onName(e) {
    let val = e.detail;
    this.setData({
      name: val
    })
  },
  onPhone(e) {
    let val = e.detail;
    this.setData({
      phone: val
    })
  },
  onAddressDetail(e) {
    let val = e.detail;
    this.setData({
      addressDetail: val
    })
  },
  onDetault(e) {
    let val = e.detail;
    this.setData({
      isDefault: val
    })
  },
  //----------------选中地区事件----------------
  showAreaPopup() {
    this.setData({
      areaShow: true
    })
  },
  //确认选中
  areaConfirm(e) {
    let val = e.detail;
    let area = val.values.map(v => v.name);
    area = area.join('-')
    this.setData({
      address: area,
      areaShow: false
    })
  },
  //取消选择
  areaCancel(e) {
    this.setData({
      areaShow: false
    })
  },
  //----------------按钮事件----------------
  //判断是否提交条件
  judge() {
    if (!this.data.name) {
      app.Toast('收货人名字未填写!')
      return false
    }
    if (!this.data.phone) {
      app.Toast('收货人手机号未填写!')
      return false
    }
    if (this.data.phone.length !== 11) {
      app.Toast('收货人手机号格式错误!')
      return false
    }
    if (!this.data.address) {
      app.Toast('收货人地址未选择!')
      return false
    }
    if (!this.data.addressDetail) {
      app.Toast('收货人地址详情未填写!')
      return false
    }
    return true
  },



  //保存
  add() {
    if (!this.judge()) {
      return
    }
    _addressAdd({
      token: wx.getStorageSync('token'),
      name: this.data.name,
      phone: this.data.phone,
      province: this.data.address.split('-')[0],
      city: this.data.address.split('-')[1],
      region: this.data.address.split('-')[2],
      detail: this.data.addressDetail,
      isdefault: this.data.isDefault ? 1 : 0
    }).then(res => {
      if (res.code == 1) {
        app.Toast('添加地址成功!', 'success')
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        app.Toast('添加地址失败!')
      }
    })
  },

  //修改
  change() {
    if (!this.judge()) {
      return
    }
    _addressChange({
      token: wx.getStorageSync('token'),
      address_id: this.data.pageInfo.address_id,
      name: this.data.name,
      phone: this.data.phone,
      province: this.data.address.split('-')[0],
      city: this.data.address.split('-')[1],
      region: this.data.address.split('-')[2],
      detail: this.data.addressDetail,
      isdefault: this.data.isDefault ? 1 : 0
    }).then(res => {
      if (res.code == 1) {
        app.Toast('修改地址成功!', 'success')
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        app.Toast('修改地址失败!')
      }
    })
  },
  //删除地址
  del() {
    wx.showModal({
      title: '提示',
      content: '您确定要删除此收货地址吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          _addressRemove({
            token: wx.getStorageSync('token'),
            address_id: this.data.pageInfo.address_id,
          }).then(res => {
            if (res.code == 1) {
              app.Toast('删除地址成功!', 'success')
              setTimeout(() => {
                wx.navigateBack();
              }, 1500);
            } else {
              app.Toast('删除地址失败!')
            }
          })
        }
      }
    });
  }

})