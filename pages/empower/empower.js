Page({
  data: {
    info:{
      username: '',
      level: ''
    },
    canvasImg: ''
  },
  async drawCanvas() {  //生成海报
    const _that = this
    wx.showLoading({ title: '海报生成中...' });
    let info = this.data.info
    //1.下载图片在本地生成临时文件
    let bg = '../../images/zheng.jpg'
    let username = info.username  //姓名
    let level = info.level   //等级
    //2.查询canvas-id 返回canvas组件对应的实例
    let ctx = wx.createCanvasContext('myCanvas', this);
    //3.设置宽高公共参数
    let obj = await this.setup()
    const x = obj.width / 750
    //4.设置canvas背景和坐标
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(0, 0, 750 * x, 1078 * x);
    //5.绘制背景图
    ctx.drawImage(bg, 0, 0, 750 * x, 1078 * x)
    //6.绘制文本
    ctx.setFontSize(x * 34)
    ctx.setFillStyle('#E4592A')
    ctx.fillText(username, 223 * x, 700 * x)
    ctx.fillText(username, 224 * x, 701 * x)
    ctx.fillText(level, 481 * x, 700 * x)
    ctx.fillText(level, 482 * x, 701 * x)
    //7.启动canvas把之前的描述进行绘制
    ctx.draw(true,
      //8.根据画布导出图片的临时路径
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success(res) {
            let canvasImg = res.tempFilePath
            _that.setData({ canvasImg })
          }
        }, this)
      }, 200)
    )
    wx.hideLoading()
  },
  setup() {  //获取盒子的宽高
    return new Promise((resolve, reject) => {
      //1.创建SelectorQuery 对象实例
      let query = this.createSelectorQuery()
      //2.返回NodesRef 对象实例，获取节点信息
      let obj = {}
      let element = query.select('.card').boundingClientRect(function (rect) {
        obj.width = rect.width
        obj.height = rect.height
        resolve(obj)
      }).exec();
    })
  },
  saveImage() { //保存图片
    let _that = this
    let canvasImg = this.data.canvasImg
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    //1.调取微信保存图片
    wx.saveImageToPhotosAlbum({
      filePath: canvasImg,
      success(res) {
        wx.hideLoading()
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#D9122B'
        })
      },
      //2.调取保存图片被拒绝处理
      fail(err) {
        wx.hideLoading()
        //3.处理微信授权和自定义弹窗授权的冲突
        let first = wx.getStorageSync('no_first')
        if (!first) {
          wx.setStorageSync('no_first', true)
          return
        }
        //4.弹出重新询问弹窗
        if (err.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
          wx.showModal({
            title: '需要授权保存图片到你的相册',
            content: '请确认授权，否则无法保存图片',
            confirmColor: '#D9122B',
            success(res) {
              if (res.confirm) {
                //4.跳转授权功能
                wx.openSetting({
                  success(res) {
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  onLoad: function (options) {
    let level = ''
    switch (options.level){
      case '1':
        level = '分销代理'
        break;
      case '2':
        level = '直属代理'
        break;
      case '3':
        level = '联创代理'
        break;
    }
    this.setData({
      'info.username': options.username,
      'info.level': level
    })
    this.drawCanvas()
  }
})