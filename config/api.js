import qs from 'qs'
const http = uni.$u.http

// 移动端登录
export const login = (tel, code) => http.post(`/shandong/user/mobileLoginNoCode?mobilePhone=${tel}&smsCode=${code}`)

// 一键登录
export const wxlogin = (tel) => http.post(`/shandong/user/mobileLoginNoCode?mobilePhone=${tel}`)

// 获取openId
export const getSessionKey = (code) => http.get(`/shandong/user/getSessionKeyAndOpenid?code=${code}`)

// 绑定用户微信ID
export const addUserOpenId = (params) => http.get(`/shandong/user/addUserOpenId?openId=${params.openId}&userId=${params.userId}`)

// 获取用户手机号
export const getUserPhoneNumber = (code) => http.get(`/shandong/user/getUserPhoneNumber?code=${code}`)

// 获取access_token
export const geAccessToken = () => http.get(`/shandong/user/getWeChatAccessToken`)

// 发送登录验证码
export const sendLoginSms = (tel) => http.post(`/userManager/sms/sendLoginSms?telephone=${tel}`)

// 完善个人信息
export const completePersonInfo = (params) => http.post(`/shandong/user/completePersonInfo`, params)

// 查询横幅图片
export const getBannerList = () => http.get(`/shandong/user/getBannerList`)

// 用户信息接口
export const getPersonalInfo = (userNumber) => http.post(`/userManager/user/getPersonalInfo?userNumber=${userNumber}`)

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

// 要货单号获取详情
export const getPurchaseDetail = (id) => http.post(`/vendorManager/order/getOrderSupplyBySupplyId?id=${id}`)

// 经销商有库存商品
export const listDealerExistGoods = (params) => http.post('/vendorManager/material/listGoodsInventory', params)

// 发货统计移动端
export const listMobileSendCount = (params) => http.post('/vendorManager/dealer/listMobileSendCount', params)

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

// 获取企业信息
export const baseCompany = () => http.post(`/vendorManager/company/selectBaseCompany`)
