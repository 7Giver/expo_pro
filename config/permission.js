const whiteList = [
	'/', // 注意入口页必须直接写 '/'
	'/pages/login/login',
	'/pages/login/detail',
]

function hasPermission(url) {
	let app_config_data = uni.getStorageSync('app_config_data')
	let token = ''
	if (app_config_data) {
		token = JSON.parse(app_config_data).token
	}
	// console.log('token', token)
	if (whiteList.indexOf(url) !== -1 || token) {
		return true
	}
	return false
}

const list = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab']
// 用遍历的方式分别为,uni.navigateTo,uni.redirectTo,uni.reLaunch,uni.switchTab这4个路由方法添加拦截器
list.forEach(item => {
	uni.addInterceptor(item, {
		invoke(e) {
			if (!hasPermission(e.url)) {
				uni.$u.toast('请先登录')
				setTimeout(() => {
					// uni.reLaunch({
					// 	url: '/pages/user/user'
					// })
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}, 800)
				return false
			}
			return e
		},
		fail(err) {
			// 失败回调拦截
			console.log(err)
		}
	})
})