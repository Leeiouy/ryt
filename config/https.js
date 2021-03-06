// import { get } from './api.js'
import api from './api.js'

// 大健康商品列表
export const healthList = (parma) => api.post('Bighealth/big_health', parma);

// 大健康代理状态
export const healthProxyStatus = (parma) => api.get('Bighealth/apply', parma);


// 申请大健康代理
export const healthProxy = (parma) => api.post('Bighealth/apply', parma);

// 大健康代理审核列表
export const proxyCheckList = (parma) => api.post('Bighealth/apply_list', parma);

// 大健康代理审核
export const proxyCheck = (parma) => api.post('Bighealth/audit', parma);

// 大健康代理审核列表 删除已拒绝
export const proxyCheckDel = (parma) => api.post('Bighealth/apply_delete', parma);

// 大健康 我的团队
export const myTeam = (parma) => api.post('distribution/health_team', parma);



// 大健康收单待收单
export const healthWait = (parma) => api.post('Bighealth/summit_them', parma);

// 大健康 收单待审核状态
export const healthAuditStatus = (parma) => api.post('Bighealth/audit_results', parma);

// 大健康 收单一键提交
export const healthFormsubmit = (parma) => api.post('Bighealth/onekey_submit', parma);


// 大健康 交单待收单
export const healthWaitS = (parma) => api.post('Bighealth/wait_submit', parma);

// 大健康 交单待审核状态
export const healthAuditStatusS = (parma) => api.post('Bighealth/approval_result', parma);

// 大健康 交单一键提交
export const healthFormsubmitS = (parma) => api.post('Bighealth/confirm_submit', parma);

// 大健康 订单商品 
export const healthGoodsDetail = (parma) => api.post('Bighealth/order_delivered', parma);


// 大健康 订单商品 
export const centerInfo = (parma) => api.post('Mycenter/my_center', parma);




//-----------------------------------登录接口---------------------------------------------
export const wxLogin = (parma) => api.post('User/wxlogin', parma);



//-----------------------------------首页接口---------------------------------------------
//首页接口
export const _getIndex = (parma) => api.post('/index/index', parma);

//常售商品
export const _getIndexGoods = (parma) => api.post('/index/index', parma);





//-----------------------------------商品详情页面------------------------------------------

//商品详情
export const _goodsDetail = (parma) => api.post('item/getItemDetail', parma);

//商品规格获取
export const _goodsSku = (parma) => api.post('item/getItemSku', parma);


//收藏商品
export const _goodsCollection = (parma) => api.post('collection/setCollect', parma);

//加入购物车
export const _addShopingCart = (parma) => api.post('item/addShopingCart', parma);


//-----------------------------------收货地址管理------------------------------------------

//收货地址列表
export const _addressList = (parma) => api.post('/Adress/getAddress', parma);

//收货地址添加
export const _addressAdd = (parma) => api.post('Adress/addAddress', parma);

//收货地址修改
export const _addressChange = (parma) => api.post('Adress/updateAddress', parma);

//收货地址删除
export const _addressRemove = (parma) => api.post('/Adress/delAddress', parma);

//收货地址默认设置
export const _addressDefault = (parma) => api.post('/Adress/setDefault', parma);

//-----------------------------------我的页面-----------------------------------------

//个人中心
export const _myCenter = (parma) => api.post('/Mycenter/my_center', parma);

//个人资料
export const _myUserInfo = (parma) => api.post('/Mycenter/userInfo', parma);







//----------------------------------订单页面----------------------------------------


//订单列表
export const _orderList = (parma) => api.post('/order/getOrderLists', parma);

//订单详情
export const _orderDetail = (parma) => api.post('/order/getOrderDetail', parma);


//删除订单
export const _delOrder = (parma) => api.post('/order/setDelOrder', parma);

//取消订单
export const _cancleOrder = (parma) => api.post('/order/setCancelOrder', parma);

//查看物流
export const _seeWl = (parma) => api.post('/order/lookLogistics', parma);

//确认收货
export const _confirmOrder = (parma) => api.post('/order/confirm_receipt', parma);

//获得发布评价页面
export const _addEvaluatePage = (parma) => api.post('/Evaluate/getAddEvaluate', parma);

//发布评价
export const _addEvaluate = (parma) => api.post('/Evaluate/addevaluate', parma);

//售后申请
export const _applyAfterSale = (parma) => api.post('/order/applyAfterSale', parma);

//售后详情
export const _applyAfterSaleDetail = (parma) => api.post('/order/getAfterSaleDetail', parma);

//售后列表
export const _applyAfterSaleList = (parma) => api.post('/order/getAfterSaleLists', parma);

//售后页面信息
export const _applyAfterSaleInfo = (parma) => api.post('/order/getApplyAfterSaleInfo', parma);



//----------------------------------团队页面----------------------------------------

//我的团队
export const _myTeam = (parma) => api.post('/distribution/team', parma);

//我的业绩
export const _mySale = (parma) => api.post('/distribution/my_sales', parma);

//业绩统计
export const _salesStatistics = (parma) => api.post('/distribution/sales_statistics', parma);

//业绩排行
export const _salesRank = (parma) => api.post('/distribution/sales_rank', parma);