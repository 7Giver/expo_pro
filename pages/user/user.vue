<template>
	<view class="content">
		<view class="status_bar"></view>
		<view class="flex-cc user_wrap">
			<u--image
				:showLoading="true"
				src="/static/PDHB.jpg"
				width="90px"
				height="90px"
				shape="circle"
			></u--image>
			<view class="nickname">{{ userInfo.systemName || '佚名' }}</view>
			<view class="inner-wrap" v-if="false">
				<u--input
					v-model="userInfo.phoneNumber"
					placeholder="账号/手机号"
					type="text"
					border="surround"
					shape="circle"
					maxlength="15"
					clearable
				></u--input>
			</view>
		</view>
		<template v-if="true">
			<!-- <view class="main_title">售后服务</view> -->
			<view class="inner_wrap">
				<!-- <view class="flex-cb item">
					<view>经销商</view>
					<view class="flex-ac right_wrap">
						<view class="text">{{ userInfo.dealerName }}</view>
					</view>
				</view> -->
				<view class="flex-cb item" @tap.native="callNumber(userInfo.phoneNumber)">
					<view>{{ userInfo.roleName || '用户' }}</view>
					<view class="flex-ac right_wrap">
						<view class="text">{{ userInfo.userName }}</view>
						<view class="text">{{ userInfo.phoneNumber }}</view>
						<u-icon name="phone" color="#18b566" size="24"></u-icon>
					</view>
				</view>
			</view>
			<!-- 授权弹窗 -->
			<!-- <view class="openAuth" @tap.native="openAuth" v-if="showSetting">订阅通知</view> -->
			<!-- <button @tap="getMenu">test</button> -->
			<button class="login_btn" type="warn" @tap="loginOut">退出登录</button>
		</template>
		<template v-if="false">
			<!-- #ifndef MP-WEIXIN -->
			<button class="login_btn" type="primary" @tap="goLogin">登录</button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button class="wx_btn" type="primary" @click="wxLogin">微信授权</button>
			<!-- #endif -->
		</template>
		<AzFooter fixed />
		<tabbar :tabbarIndex="4" />
	</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { baseCompany } from '@/config/api.js'
import AzFooter from '@/components/azFooter/azFooter.vue'

onShow(() => {
	init()
})

const store = useStore()
const hasToken = computed(() => store.getters.hasToken)
const userInfo = computed(() => store.state.userInfo)

const init = () => {
	// #ifdef MP-WEIXIN
	getArouth()
	// #endif
	// getCompany()
}

// 登录
const goLogin = () => {
	const tel = userInfo.value.phoneNumber
	if (uni.$u.test.isEmpty(tel)) {
		uni.$u.toast('请输入账号')
		return
	}
	// if (!uni.$u.test.mobile(tel)) {
	// 	uni.$u.toast('请输入正确的手机号')
	// 	return
	// }
	// test 13771009083
	store.dispatch('login', userInfo.value.phoneNumber)
}

// 退出登录
const loginOut = () => {
	store.dispatch('loginOut')
}

// 获取权限菜单
const getMenu = () => {
	let params = {
		systemUuid: '3',
		userUuid: store.state.userInfo.uuid
	}
	getSystemMenu(params)
		.then(res => {
			console.log('getSystemMenu >>>>>', res)
		})
		.catch(e => {
			console.log(e)
		})
}

const callNumber = tel => {
	if (!tel || tel == '') return
	uni.makePhoneCall({
		phoneNumber: tel
	})
}

const wxLogin = () => {
	uni.getUserProfile({
		lang: 'zh_CN',
		desc: '获取用户信息',
		success: res => {
			console.log(res, 'userInfo')
			store.state.userInfo.avatar = res.userInfo.avatarUrl
			store.state.userInfo.userName = res.userInfo.userName
			uni.login({
				provider: 'weixin',
				success: loginInfo => {
					console.log(loginInfo, 'loginInfo')
					goLogin()
				}
			})
		},
		fail: err => {
			console.log(err, 'err')
		}
	})
}

// 获取公司logo
const getCompany = async () => {
	const { code, data } = await baseCompany()
	// console.log('getCompany', data)
	store.state.userInfo.avatar = data.logoPath
}

const openAuth = () => {
	// #ifdef H5
	uni.$u.toast('请在小程序订阅')
	// #endif
	// #ifdef MP-WEIXIN
	uni.requestSubscribeMessage({
		tmplIds: [
			'MlcjtIFU8G06ywIbozColjehejPZO7VCeCLP7D7p9A0',
			'dvU7pM2M347kcrlFpgGKJyB2uHhjN3qgOnmvBmD1Oo8',
			'SYNVVf2tTHaIYgdTMHJI2W9G48RQebgQSy67Da0AabY'
		],
		success(res) {
			console.log('SubscribeMessage', res)
		}
	})
	// #endif
}

const getArouth = () => {
	wx.getSetting({
		withSubscriptions: true,
		success(res) {
			console.log('getSetting subscriptionsSetting >>', res.subscriptionsSetting)
			const subscriptionsSetting = res.subscriptionsSetting
			let arr = Object.keys(subscriptionsSetting.itemSettings ?? {})
			let flag = !Boolean(arr.length >= 3) ?? true
			showSetting.value = flag
			// console.log('subscriptionsSetting', arr.length)
		}
	})
}
</script>

<style lang="scss" scoped>
.content {
	position: relative;
	height: 100vh;
	font-size: 26rpx;
}
.status_bar {
	height: calc(var(--status-bar-height) + 5px);
	width: 100%;
}
.user_wrap {
	padding: 180rpx 30rpx 100rpx;
	.nickname {
		margin-top: 30rpx;
	}
	.inner-wrap {
		margin-top: 70rpx;
		width: 550rpx;
	}
}
.main_title {
	padding-left: 30rpx;
}
.inner_wrap {
	font-size: 30rpx;
	padding: 26rpx 30rpx;
	margin-top: 20rpx;
	background-color: #ffffff;
	.item:not(:last-child) {
		padding-bottom: 40rpx;
	}
	.right_wrap {
		.text {
			margin-right: 18rpx;
		}
	}
}
.login_btn {
	position: absolute;
	left: 50%;
	bottom: 22%;
	transform: translate(-50%, -50%);
	width: 90%;
	margin: 130rpx auto;
}
.wx_btn {
	width: 90%;
	margin: 0 auto;
}
</style>
