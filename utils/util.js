// 时间戳转换成日期
// @param date {Date} 需要转换的时间戳
// @param type {String} 转换类型，默认显示年月日时分秒，'hms' 不显示时分秒
// @return 2018-04-01 00:00
const formatTime = (date, type) => {
  var date = new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  let ymd = [year, month, day].map(formatNumber).join('-'); // 年月日
  let hms = [hour, minute, second].map(formatNumber).join(':'); // 时分秒
  let hm = [hour, minute].map(formatNumber).join(':'); // 时分秒

  // return (type == 'hms') ? ymd : (ymd + ' ' + hms);
  if (type == 'hms') {
    return ymd
  };
  if (type == 'hm') {
    return hm
  };
  if (type == 'count') {
    return hms
  };
  return ymd + ' ' + hms
}
// 将一位数转换成0开头，例如： 1 -> 01
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//
const countDown = (rest) => {
  let days = formatNumber(parseInt(rest / 60 / 60 / 24)),
      hours = formatNumber(parseInt(rest / 60 / 60 % 24)),
      minutes = formatNumber(parseInt(rest / 60 % 60)),
      seconds = formatNumber(parseInt(rest % 60));
  return days + '天' + hours + '小时' + minutes + '分' + seconds + '秒'
}

// 秒杀
const seckill = (rest) => {
  let days = formatNumber(parseInt(rest / 60 / 60 / 24)),
      hours = formatNumber(parseInt(rest / 60 / 60 % 24)),
      minutes = formatNumber(parseInt(rest / 60 % 60)),
      seconds = formatNumber(parseInt(rest % 60));
      if(Number(days) > 0){
        hours = formatNumber(Number(hours) + (24 * Number(days)))
      }
  return { d:days, h: Number(hours) > 99 ? 99 : hours, m: minutes, s: seconds }
}

module.exports = {
  formatTime: formatTime, //将时间戳转换成日期
  countDown: countDown,
  seckill: seckill //秒杀倒计时
}
