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






//-----------------------------------首页接口-------------------------------------------------------


export const getIndex = (parma) => api.post('/index/index', parma);












//-----------------------------------商品详情页面-------------------------------------------------------
//商品详情
export const goodsDetail = (parma) => api.post('item/getItemDetail', parma);
//收藏商品
export const goodsCollection = (parma) => api.post('collection/setCollect', parma);

//加入购物车
export const addShopingCart = (parma) => api.post('item/addShopingCart', parma);