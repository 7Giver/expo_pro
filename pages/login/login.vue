<template>
	<view class="content">
		<!-- <view class="status_bar"></view> -->
		<view class="flex-cc user_wrap">
			<u--image
				:showLoading="true"
				src="/static/logo.png"
				width="80px"
				height="80px"
				shape="circle"
			></u--image>
			<view class="nickname">经销商CRM</view>
		</view>
		<view class="inner-wrap" v-if="loginIndex == 1">
			<view class="flex-ac item">
				<u-icon name="account" color="#2979ff" size="24"></u-icon>
				<u--input
					v-model="userInfo.phoneNumber"
					placeholder="账号/手机号"
					type="number"
					border="none"
					maxlength="15"
					clearable
				></u--input>
			</view>
			<view class="flex-ac item">
				<u-icon name="bookmark" color="#2979ff" size="22"></u-icon>
				<view class="flex-cb" style="flex: 1">
					<u--input
						v-model="userInfo.code"
						placeholder="请输入验证码"
						type="number"
						border="none"
						maxlength="12"
						clearable
					></u--input>
					<u-button
						type="primary"
						:text="tips"
						:customStyle="customStyle"
						shape="circle"
						@click="getCode"
					></u-button>
					<!-- <text @click="getCode" style="color: #2979ff">{{ tips }}</text> -->
				</view>
			</view>
		</view>
		<view class="btn-wrap">
			<button
				class="wx_btn"
				type="primary"
				open-type="getPhoneNumber"
				@getphonenumber="goWxLogin"
				v-if="loginIndex == 0"
			>
				一键登录
			</button>
			<u-button
				class="login_btn"
				type="primary"
				size="large"
				text="登录"
				@click="goLogin"
				v-if="loginIndex == 1"
			></u-button>
		</view>
		<view class="flex-ca bottom-wrap">
			<view class="flex-cc item" @tap.native="toggleLogin(0)">
				<u-icon
					:name="loginIndex ? 'weixin-circle-fill' : 'weixin-fill'"
					color="#07c160"
					size="44"
				></u-icon>
				<view :class="loginIndex ? '' : 'wx-active'">微信登录</view>
			</view>
			<view class="flex-cc item" @tap.native="toggleLogin(1)">
				<u-icon :name="loginIndex ? 'phone-fill' : 'phone'" color="#3c9cff" size="42"></u-icon>
				<view :class="loginIndex ? 'active' : ''">账号登录</view>
			</view>
		</view>
		<!-- 倒计时 -->
		<u-code ref="codeRef" :seconds="seconds" keep-running @change="codeChange"></u-code>
		<AzFooter fixed></AzFooter>
	</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { getSystemMenu, sendLoginSms, getUserPhoneNumber } from '@/config/api.js'
import AzFooter from '@/components/azFooter/azFooter.vue'

onShow(() => {
	init()
})

onMounted(() => {
	userInfo.value = store.state.userInfo
})

const store = useStore()
const loginIndex = ref(0)
const userInfo = ref({})
const codeRef = ref(null)
const seconds = ref(60)
const tips = ref('')
const customStyle = {
	width: '200rpx',
	height: '64rpx',
	fontSize: '20rpx'
}
const hasToken = computed(() => store.getters.hasToken)

// 加载
const init = () => {
	let token = store.state.token
	// console.log('token', token)
}

const codeChange = text => {
	// console.log('codeChange', text)
	tips.value = text
}

const toggleLogin = index => {
	loginIndex.value = index
}

const getCode = () => {
	// console.log('codeRef', codeRef.value)
	const tel = userInfo.value.phoneNumber
	if (uni.$u.test.isEmpty(tel)) {
		uni.$u.toast('请输入手机号')
		return
	}
	if (!uni.$u.test.mobile(tel)) {
		uni.$u.toast('请输入正确的手机号')
		return
	}
	if (codeRef.value.canGetCode) {
		// 模拟向后端请求验证码
		uni.showLoading({
			title: '正在获取验证码'
		})
		goSendMsg()
	} else {
		uni.$u.toast('倒计时结束后再发送')
	}
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

// 请求获取验证码
const goSendMsg = async () => {
	const { code, data } = await sendLoginSms(userInfo.value.phoneNumber)
	if (code !== 200) return
	uni.$u.toast('验证码已发送')
	codeRef.value.start()
}

// 登录
const goLogin = () => {
	const tel = userInfo.value.phoneNumber
	const code = userInfo.value.code
	if (uni.$u.test.isEmpty(tel)) {
		uni.$u.toast('请输入手机号')
		return
	}
	if (uni.$u.test.isEmpty(code)) {
		uni.$u.toast('请输入验证码')
		return
	}
	uni.showToast({
		title: '正在加载',
		icon: 'loading'
	})
	let params = {
		tel: userInfo.value.phoneNumber,
		code: userInfo.value.code
	}
	store.dispatch('login', params)
}

// 一键登录
const goWxLogin = async e => {
	// #ifdef MP-WEIXIN
	// console.log('goWxLogin', e.detail)
	const js_code = e.detail.code
	const { code, data } = await getUserPhoneNumber(js_code)
	if (code !== 200) return
	store.dispatch('wxLogin', data.phoneNumber)
	// #endif
	// #ifdef H5
	console.log('请使用小程序打开')
	// #endif
}
</script>

<style lang="scss" scoped>
.content {
	position: relative;
	height: 100vh;
	font-size: 26rpx;
	padding: 0 36rpx;
}
.status_bar {
	height: calc(var(--status-bar-height) + 5px);
	width: 100%;
}
.user_wrap {
	padding: 100rpx 0 70rpx;
	.nickname {
		color: #333;
		font-size: 32rpx;
		margin-top: 26rpx;
	}
}
.inner-wrap {
	padding: 10rpx 30rpx 10rpx;
	background: #fff;
	border-radius: 10px;
	.item {
		padding: 20rpx 0;
		&:not(:last-child) {
			border-bottom: 1px solid #dadbde;
		}
		.u-icon {
			margin-right: 20rpx;
		}
		.code-btn {
			margin-left: 30rpx;
			height: 60rpx;
			// line-height: 60rpx;
		}
	}
}
.main_title {
	padding-left: 30rpx;
}
.inner_wrap {
	padding: 26rpx 30rpx;
	margin-top: 20rpx;
	background-color: #ffffff;
	.right_wrap {
		.text {
			margin-right: 18rpx;
		}
	}
}
.btn-wrap {
	// position: absolute;
	// left: 0;
	// bottom: 30%;
	margin-top: 10%;
	.wx_btn {
		height: 90rpx;
		margin: 0 auto 60rpx;
	}
	.login_btn {
		height: 80rpx;
	}
}
.bottom-wrap {
	// position: absolute;
	// left: 50%;
	// bottom: 30%;
	// transform: translate(-50%, 0);
	width: 100%;
	margin-top: 40rpx;
	.item {
		width: 170rpx;
		height: 170rpx;
		color: #999;
		font-size: 26rpx;
		line-height:55rpx;
		// background: #fff;
		border-radius: 50%;
	}
	.active {
		color: $u-primary;
		font-weight: bold;
	}
	.wx-active {
		color: #07c160;
		font-weight: bold;
	}
}
</style>
