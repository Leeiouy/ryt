// 统一的请求接口
// const baseUrl = 'https://riyuetaoguoji.com/api/';
const baseUrl = 'https://ptlf.0791jr.com/api/';
const http = ({
  url = '',
  param = {},
  ...other
} = {}) => {
  wx.showLoading({
    title: '加载中~',
    mask: true
  });
  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: param,
      header: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      ...other,
      complete: (res) => {
        wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 300) { //请求成功
          resolve(res.data)
        } else { //请求失败
          wx.showToast({
            title: '访问服务器失败，请稍后再试',
            icon: 'none'
          })
          reject(res.data)
        }
      }
    })
  }).catch((res) => {
    wx.hideLoading();
    wx.showToast({
      title: '网络错误~',
      icon: 'none'
    })
  })
}

const getUrl = (url) => {
  if (url.indexOf('://') == -1) {
    url = baseUrl + url;
  }
  return url
}

// get方法
const _get = (url, param = {}) => {
  return http({
    url,
    param
  })
}

const _post = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'post'
  })
}

const _put = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'put'
  })
}

const _delete = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'put'
  })
}
module.exports = {
  baseUrl,
  get: _get,
  post: _post,
  put: _put,
  delete: _delete
}