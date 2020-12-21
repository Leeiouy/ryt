import _areaList from '../../config/area';

Page({
  data: {
    name: '', //收货人
    phone: '', //手机号
    address: '', //地区
    addressDetail: '', //地区详情


    areaList: _areaList,
    isDefault: false,



    areaShow: false, //是否展示地区选择弹出层
  },
  onLoad: function (options) {
    console.log(_areaList);
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
    let area = e.detail.values.map(v => v.name);
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




  //保存
  save() {
    
    
  },
  //删除地址
  del() {}

})