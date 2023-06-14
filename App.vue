<script>
export default {
	onLaunch: function () {
		console.log('App Launch')
	},
	onShow: function () {
		// #ifdef MP-WEIXIN
		const updateManager = uni.getUpdateManager()
		updateManager.onCheckForUpdate(function (res) {
			// 请求完新版本信息的回调
			console.log('onCheckForUpdate', res.hasUpdate)
		})
		updateManager.onUpdateReady(function (res) {
			uni.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})
		})
		updateManager.onUpdateFailed(function (res) {
			console.log('onUpdateFailed', res)
			// 新的版本下载失败
		})
		//#endif
	},
	onHide: function () {
		console.log('App Hide')
	}
}

const whiteList = [
	'/', // 注意入口页必须直接写 '/'
	'/pages/login/login',
	'/pages/login/detail'
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
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import '@/uni_modules/uview-plus/index.scss';
@import '@/static/base.scss';
</style>
