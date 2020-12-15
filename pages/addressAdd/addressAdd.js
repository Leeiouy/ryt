// pages/addressAdd/addressAdd.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'', //省市区
    formWeb:"",
    shperson:"",
    mobile:"",
    address:"",
    text: '',
    province:'',
    city:'',
    regionz:''
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const formWeb = options.formWeb;
    if (formWeb == 'order') {
      this.setData({
        formWeb: 'order'
      });
    }
  },

  //选择省市区
  regionChange(e){
    this.setData({
      address: e.detail.value
    })
  },

  init(e){
    this.setData({
      text: e.detail.value
    })
  },

  //提交数据
  formSubmit: function (e) {
    const token = wx.getStorageSync('token');
    const shperson = e.detail.value.username, //收货人姓名
      mobile = e.detail.value.mobile, //收货人手机号
      region = e.detail.value.region.join(',') || this.data.address, //收货地址
      detail_info = e.detail.value.detail, //详细地址
      status = e.detail.value.default - 0; //是否默认，布尔值转换成数字
    const reg = /^1[23456789]\d{9}$/;
    const regs = /^0791\d{8}$/;
    console.log(region)
    console.log(region.split(',')[0])
    console.log(region.split(',')[1])
    console.log(region.split(',')[2])
    //进行验证判断
    if (!shperson) { this.toast('请输入收货人'); return; }
    if (!mobile) { this.toast('请输入联系电话'); return;}
    if (!(reg.test(mobile) || regs.test(mobile))) { this.toast('手机号格式不正确'); return;}
    if (!region) { this.toast('请选择省市区'); return; }
    if (!detail_info) { this.toast('请输入详细地址'); return; }
    
    //发送网络请求
    wx.request({
      url: app.baseURL +'/Adress/addAddress',
      data: {
        token: token,
        name: shperson,
        phone: mobile,
        province:this.data.province ? this.data.province : region.split(',')[0],
        city: this.data.city ? this.data.city : region.split(',')[1],
        region: this.data.regionz ? this.data.regionz : region.split(',')[2],
        detail: detail_info,
        isdefault: status 
      },
      success: (res) => {
        console.log(res)
        if(res.data.code==1){
                wx.navigateBack()
        }
        // if (res.data.status == 5) {
        let addressInfo = {
          name: shperson,
          phone: mobile,
          region: region,
          detail: detail_info,
          }
          
          //如果从下单详情页面进入的本页面
          if (this.data.formWeb) this.formOrder(addressInfo);
          //返回上一页
        // } else if (res.data.status == 6) this.toast('添加失败，请重试'); 
      },
      fail: (res) => { this.toast('网络错误！'); }
    })
  },

  //如果是从下单详情页面进来
  //添加地址完成后要返回下单详情页面,并且更新地址信息
  formOrder(add_res) {
    //获取页面栈
    let pages = getCurrentPages();
    //获取上一个页面
    let prev = pages[pages.length - 2];
    //调用上一个页面的setData方法，从而达到naviagtreBack返回传参的效果
    //简单粗暴
    prev.setData({
      add_res: add_res //添加的地址数据
    });
  },

  //简化提示函数
  toast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none'
    })
  },

  // 同步微信地址
  getCity() {
    let that = this;
    wx.chooseAddress({
      success (res) {
        console.log(res);
        that.setData({
          shperson: res.userName, 
          mobile: res.telNumber,
          address: res.provinceName + "," + res.cityName + "," + res.countyName,
          detail_info: res.detailInfo
        })
      }
    })
  },

  //智能识别
  changtext: function (e) {
    if(this.data.text){
      //省
      var Province = ["广东", "北京", "浙江", "福建", "湖北", "上海", "江苏", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "安徽", "江西", "山东", "河南", "湖南", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆", "台湾", "香港", "澳门"];
      //姓氏
      var familyName = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '楮', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', "张", '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闽', '席', '季', '麻', '强', '贾', '路', '娄', '危', '江', '童', '颜', '郭', '梅', '盛', '林', '刁', '锺', '徐', '丘', '骆', '高', '夏', '蔡', '田', '樊', '胡', '凌', '霍', '虞', '万', '支', '柯', '昝', '管', '卢', '莫', '经', '房', '裘', '缪', '干', '解', '应', '宗', '丁', '宣', '贲', '邓', '郁', '单', '杭', '洪', '包', '诸', '左', '石', '崔', '吉', '钮', '龚', '程', '嵇', '邢', '滑', '裴', '陆', '荣', '翁', '荀', '羊', '於', '惠', '甄', '麹', '家', '封', '芮', '羿', '储', '靳', '汲', '邴', '糜', '松', '井', '段', '富', '巫', '乌', '焦', '巴', '弓', '牧', '隗', '山', '谷', '车', '侯', '宓', '蓬', '全', '郗', '班', '仰', '秋', '仲', '伊', '宫', '宁', '仇', '栾', '暴', '甘', '斜', '厉', '戎', '祖', '武', '符', '刘', '景', '詹', '束', '龙', '叶', '幸', '司', '韶', '郜', '黎', '蓟', '薄', '印', '宿', '白', '怀', '蒲', '邰', '从', '鄂', '索', '咸', '籍', '赖', '卓', '蔺', '屠', '蒙', '池', '乔', '阴', '郁', '胥', '能', '苍', '双', '闻', '莘', '党', '翟', '谭', '贡', '劳', '逄', '姬', '申', '扶', '堵', '冉', '宰', '郦', '雍', '郤', '璩', '桑', '桂', '濮', '牛', '寿', '通', '边', '扈', '燕', '冀', '郏', '浦', '尚', '农', '温', '别', '庄', '晏', '柴', '瞿', '阎', '充', '慕', '连', '茹', '习', '宦', '艾', '鱼', '容', '向', '古', '易', '慎', '戈', '廖', '庾', '终', '暨', '居', '衡', '步', '都', '耿', '满', '弘', '匡', '国', '文', '寇', '广', '禄', '阙', '东', '欧', '殳', '沃', '利', '蔚', '越', '夔', '隆', '师', '巩', '厍', '聂', '晁', '勾', '敖', '融', '冷', '訾', '辛', '阚', '那', '简', '饶', '空', '曾', '毋', '沙', '乜', '养', '鞠', '须', '丰', '巢', '关', '蒯', '相', '查', '后', '荆', '红', '游', '竺', '权', '逑', '盖', '益', '桓', '公', '万俟', '司马', '上官', '欧阳', '夏侯', '诸葛', '闻人', '东方', '赫连', '皇甫', '尉迟', '公羊', '澹台', '公冶', '宗政', '濮阳', '淳于', '单于', '太叔', '申屠', '公孙', '仲孙', '轩辕', '令狐', '锺离', '宇文', '长孙', '慕容', '鲜于', '闾丘', '司徒', '司空', '丌官', '司寇', '仉', '督', '子车', '颛孙', '端木', '巫马', '公西', '漆雕', '乐正', '壤驷', '公良', '拓拔', '夹谷', '宰父', '谷梁', '晋', '楚', '阎', '法', '汝', '鄢', '涂', '钦', '段干', '百里', '东郭', '南门', '呼延', '归', '海', '羊舌', '微生', '岳', '帅', '缑', '亢', '况', '后', '有', '琴', '梁丘', '左丘', '东门', '西门', '商', '牟', '佘', '佴', '伯', '赏', '南宫', '墨', '哈', '谯', '笪', '年', '爱', '阳', '佟', '第五', '言', '福'];
    
      var other = [];
      var nameAndaddress = '';
      var Name = '';
      var address = '';
      var province ='';
      var city = '';
      var region = '';
      var detail_info = '';
      let nameIn = this.data.text;
      // let nameIn = "陕西省西安市雁塔区大雁塔街道广场  张剑 18686868866 ";
      let name = nameIn.replace(/[&\|\\\*^%$￥,，（）()#@\-]/g,"")
      var phone = name.match(/((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8})|((\d3,4|\d{3,4}-|\s)?\d{7,14}))?/g);
      if (phone != null || phone != '') {
        phone = phone.toString().replace(new RegExp(",", "g"), '').replace(new RegExp(" ", "g"), '');
        other = name.split(phone);
        console.log(other)
        if (other[0] == '') {//地址在电话号码后面
          //去掉手机号剩下的
          console.log(other[1])
          nameAndaddress = other[1].replace(new RegExp(" ", "g"), '');
          console.log(nameAndaddress)
          for (let i = 0; i < Province.length; i++) {
            console.log(9999)        
            if (nameAndaddress.indexOf(Province[i]) == 0) {//第一位是省份
              for (let j = 0; j < familyName.length; j++) {
                if (nameAndaddress.lastIndexOf(familyName[j]) != -1) {//有姓氏
                  console.log('有姓氏')
                  let index = nameAndaddress.indexOf(familyName[j]);
                  //截取字符串
                  //前面为地址 后面为姓氏
                if(index > 0){
                    let seeion = nameAndaddress.indexOf('区')
                    address = nameAndaddress.substring(0, seeion+1);
                    let pri = address.indexOf('省')
                    province = address.substring(0,pri+1)
                    let cit = address.indexOf('市')
                    city = address.substring(pri+1,cit+1)
                    region =address.substring(cit+1,address.length)
                    console.log(province,city,region)
                    detail_info = nameAndaddress.substring(seeion + 1, index)
                    Name = nameAndaddress.substring(index, nameAndaddress.length);
                    console.log(index);
                }
                  break;
                } else {//没有姓氏
                  console.log('没有姓氏')
                }
              }
              break;
            } else {
                if(nameAndaddress.indexOf(familyName[i]) == 0){
                  console.log("姓名在前")
                  for(let k = 0 ;k < familyName.length ; k++){
                    let index = nameAndaddress.indexOf(Province[k]);
                    if(index > 0){
                      console.log(Province[k])
                      Name = nameAndaddress.substring(0, index);
                      let seeion = nameAndaddress.indexOf('区')
                      address = nameAndaddress.substring(index, seeion+1);
                      let pri = address.indexOf('省')
                      province = address.substring(0, pri + 1)
                      let cit = address.indexOf('市')
                      city = address.substring(pri + 1, cit + 1)
                      region = address.substring(cit + 1, address.length)
                      detail_info = nameAndaddress.substring(seeion+1, nameAndaddress.length)
                    }
                  }
                }
            }
          }

        } else if (other[1] == '') {   //地址在电话号码前面
          //去掉手机号剩下的
          nameAndaddress = other[0].replace(new RegExp(" ", "g"), '');

          for (let i = 0; i < Province.length; i++) {

            if (nameAndaddress.indexOf(Province[i]) == 0) {//第一位是省份
              for (let i = 0; i < familyName.length; i++) {
                if (nameAndaddress.lastIndexOf(familyName[i]) != -1) {//有姓氏
                  console.log('有姓氏')
                  let index = nameAndaddress.lastIndexOf(familyName[i]);
                  //截取字符串
                  //前面为地址 后面为姓氏
                  let seeion = nameAndaddress.indexOf('区')
                  address = nameAndaddress.substring(0, seeion + 1);
                  let pri = address.indexOf('省')
                  province = address.substring(0, pri + 1)
                  let cit = address.indexOf('市')
                  city = address.substring(pri + 1, cit + 1)
                  region = address.substring(cit + 1, address.length)
                  detail_info = nameAndaddress.substring(seeion + 1, index)
                  Name = nameAndaddress.substring(index, nameAndaddress.length);
                  console.log(index);
                  break;
                } else {//没有姓氏
                  console.log('没有姓氏')
                }
              }
              break;
            } else if (nameAndaddress.indexOf(Province[i]) == -1) {//没有省份信息
              console.log('没有省份信息')
            } else {//不在第一位
              //截取字符串
              //前面为姓名  后面为地址
              let index = nameAndaddress.indexOf(Province[i]);
              Name = nameAndaddress.substring(0, index);
              let seeion = nameAndaddress.indexOf('区')
              address = nameAndaddress.substring(index, seeion + 1);
              let pri = address.indexOf('省')
              province = address.substring(0, pri + 1)
              let cit = address.indexOf('市')
              city = address.substring(pri + 1, cit + 1)
              region = address.substring(cit + 1, address.length)
              detail_info = nameAndaddress.substring(seeion + 1, nameAndaddress.length)
              
            }
          }
        } else {
          console.log('手机号在中间');
          if (other[0].length > other[1].length) {
            let address_p = other[0];
            let seeion = address_p.indexOf('区')
            address = address_p.substring(0, seeion + 1);
            let pri = address.indexOf('省')
            province = address.substring(0, pri + 1)
            let cit = address.indexOf('市')
            city = address.substring(pri + 1, cit + 1)
            region = address.substring(cit + 1, address.length)
            console.log(province, city, region)
            detail_info = address_p.substring(seeion + 1, address_p.length)
            Name = other[1];
            console.log('姓名在后面');


          } else if (other[0].length < other[1].length) {
            console.log('姓名在前面');
            let address_p = other[1];
            let seeion = address_p.indexOf('区')
            address = address_p.substring(0, seeion + 1);
            let pri = address.indexOf('省')
            province = address.substring(0, pri + 1)
            let cit = address.indexOf('市')
            city = address.substring(pri + 1, cit + 1)
            region = address.substring(cit + 1, address.length)
            detail_info = address_p.substring(seeion + 1, address_p.length)
            Name = other[0];
          }

        }

      } else {
        //没有正确的手机号码
        wx.showToast({
          title: '没有正确的手机号码',
        })
      }
      console.log(other)
      console.log(nameAndaddress)
      console.log(phone);
      console.log(Name);
      console.log(address);
      if (Name == '' || phone == '') {
        wx.showToast({
          title: '识别异常',
          icon:'none'
        })
      }

      this.setData({
        shperson: Name,
        mobile: phone,
        address: address,
        province:province,
        city:city,
        regionz:region,
        detail_info: detail_info,
        showView: false,
      })
    }else{
      wx.showToast({
        title: '请粘贴地址',
        icon:'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  }
})