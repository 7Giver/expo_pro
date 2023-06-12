import qs from 'qs'
const http = uni.$u.http

// 移动端登录
export const login = (tel, code) => http.post(`/userManager/user/mobileLogin?mobilePhone=${tel}&smsCode=${code}`)

// 一键登录
export const wxlogin = (tel) => http.post(`/userManager/user/mobileLoginNoCode?mobilePhone=${tel}`)

// 获取openId
export const getSessionKey = (code) => http.get(`/userManager/user/getSessionKeyAndOpenid?code=${code}`)

// 绑定用户微信ID
export const addUserOpenId = (params) => http.get(`/userManager/user/addUserOpenId?openId=${params.openId}&userId=${params.userId}`)

// 获取用户手机号
export const getUserPhoneNumber = (code) => http.get(`/vendorManager/dataCenter/getUserPhoneNumber?code=${code}`)

// 获取access_token
export const geAccessToken = () => http.get(`/vendorManager/dataCenter/getWeChatAccessToken`)

// 发送登录验证码
export const sendLoginSms = (tel) => http.post(`/userManager/sms/sendLoginSms?telephone=${tel}`)

// 用户信息接口
export const getPersonalInfo = (userNumber) => http.post(`/userManager/user/getPersonalInfo?userNumber=${userNumber}`)

// 获取人员菜单列表
export const getSystemMenu = (params) => http.post('/userManager/security/getSystemMenuList', params)

// 首页分类导航
export const getTabList = (params) => http.post('/vendorManager/material/listMaterialType2', params)

// 首页商品分页
export const getListGoods = (params) => http.post('/vendorManager/material/listMaterialGoods', params)

// 要货单提交
export const addOrderSupply = (params) => http.post('/vendorManager/order/addOrderSupply', params)

// 要货单列表
export const listOrderSupply = (params) => http.post('/vendorManager/order/listMobileOrderSupply', params)

// 要货单详情
export const getOrderSupplyById = (id) => http.post(`/vendorManager/order/getOrderSupplyById?id=${id}`)

// 要货单修改
export const updateOrderSupply = (params) => http.post(`/vendorManager/order/updateOrderSupply`, params)

// 要货单删除
export const deleteOrderSupply = (id) => http.post(`/vendorManager/order/deleteOrderSupply?id=${id}`)

// 收货单列表
export const listOrderSend = (params) => http.post('/vendorManager/order/listMobileOrderSend', params)

// 收货单详情
export const getSendDetail = (id) => http.post(`/vendorManager/order/getMobileSendDetail?supplyId=${id}`)

// 要货单号获取详情
export const getPurchaseDetail = (id) => http.post(`/vendorManager/order/getOrderSupplyBySupplyId?id=${id}`)

// 确认/取消收货
export const updateOrderReceive = (params) => http.post(`/vendorManager/order/updateOrderReceive?${qs.stringify(params)}`)

// 库存管理列表
export const listGoodsInventory = (params) => http.post('/vendorManager/material/listGoodsInventory2', params)

// 查询换算单位
export const listUnitConversion = () => http.post('/vendorManager/material/listUnitConversion')

// 库存更新
export const updateInventory = (params) => http.post('/vendorManager/material/addOrUpdateInventory', params)

// 库存变更记录
export const listInventoryRecord = (params) => http.post(`/vendorManager/material/listInventoryRecord`, params)

// 经销商有库存商品
export const listDealerExistGoods = (params) => http.post('/vendorManager/material/listGoodsInventory', params)

// 获取快递种类
export const getDicTypeList = (type) => http.post(`/userManager/dic/getDicTypeList?type=${type}`)

// 发货统计移动端
export const listMobileSendCount = (params) => http.post('/vendorManager/dealer/listMobileSendCount', params)

// 销售单列表
export const listDealerSend = (params) => http.post('/vendorManager/dealer/listDealerSend', params)

// 去销售
export const dealerToSend = (params) => http.post('/vendorManager/dealer/dealerToSend', params)

// 取消发货
export const dealerCancelSend = (id) => http.post(`/vendorManager/dealer/dealerCancelSend?id=${id}`)

// 查询经销商的客户
export const listDealerCustomer = (params) => http.post('/vendorManager/dealer/listDealerCustomer', params)

// 发货预警提示
export const dealerSendWarning = (id) => http.post(`/vendorManager/dealer/dealerSendWarning?dealerId=${id}`)

// 营业额日月排行
export const listDaySaleMoneyOrder = (params) => http.post('/vendorManager/dealer/count/daySaleMoneyOrder', params)

// 销量日月排行
export const listDaySaleNumberOrder = (params) => http.post('/vendorManager/dealer/count/daySaleNumberOrder', params)

// 要货日月排行
export const listDaySupplyNumberOrder = (params) => http.post('/vendorManager/dealer/count/daySupplyNumberOrder', params)

// 根据用户查询经销商仓库
export const listWarehouseByUser = (id) => http.get(`/vendorManager/dealer/listWarehouseByUser?userId=${id}`)

// 上传图片
// export const uploadPictureFile = (params) => http.post('/vendorManager/file/uploadPictureFile', params)

// 删除图片
export const deleteBaseFile = (fileId) => http.post(`/vendorManager/file/deleteBaseFile?fileId=${fileId}`)

// 新增退货单
export const addDealerReturn = (params) => http.post(`/vendorManager/dealer/addDealerReturn`, params)

// 发货单详情（退货用）
export const getOneSendDetail = (id) => http.post(`/vendorManager/order/getOneSendDetail?sendId=${id}`)

// 获取企业信息
export const baseCompany = () => http.post(`/vendorManager/company/selectBaseCompany`)

// 获取经销商发货周期
export const getDealerSendDays = (id) => http.post(`/vendorManager/dealer/getDealerSendDays?dealerId=${id}`)

// 根据库存商品查询批次
export const getInventoryBatch = (params) => http.post(`/vendorManager/inventory/getInventoryBatch`, params)

// 获取分类商品列表
export const getGoodsAndType = (params) => http.post(`/vendorManager/material/getGoodsAndType`, params)

// 去销售库存商品分类
export const listDealerGoodsNew = (params) => http.post(`/vendorManager/dealer/listDealerGoodsNew`, params)

// 查询经销商退货列表
export const listDealerReturn = (params) => http.post(`/vendorManager/dealer/listDealerReturn`, params)

// 查询经销商告警配置
export const getWarnManage = (dealerId) => http.get(`/vendorManager/dealer/getWarnManage?dealerId=${dealerId}`)

// 启停经销商告警配置
export const startOrStopWarn = (params) => http.get(`/vendorManager/dealer/startOrStopWarn?dealerId=${params.dealerId}&usedFlag=${params.flag}`)

// 用户列表
export const listBaseUser = (params) => http.post(`/userManager/user/listBaseUser`, params)

// 更新告警配置
export const updateWarnManage = (params) => http.post(`/vendorManager/dealer/updateWarnManage`, params)