<template>
	<view class="content">
		<view class="form-wrap">
			<u--form ref="uForm" :model="form" :rules="rules" labelWidth="auto">
				<u-form-item label="姓名：" prop="name">
					<u-input v-model="form.name" border="bottom" />
				</u-form-item>
				<u-form-item label="品牌：" prop="brand">
					<u-input v-model="form.brand" border="bottom" />
				</u-form-item>
				<u-form-item label="职位：" prop="company">
					<u-input v-model="form.company" border="bottom" />
				</u-form-item>
				<u-form-item label="地区：" prop="address">
					<u-input v-model="form.address" border="bottom" />
				</u-form-item>
				<u-form-item label="规模：" prop="scale">
					<u-input v-model="form.scale" border="bottom" />
				</u-form-item>
			</u--form>
		</view>
		<u-button class="login-btn" type="primary" size="large" @click="submit">提交</u-button>
	</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { completePersonInfo } from '@/config/api.js'

onShow(() => {
	// init()
})

const uForm = ref()
const form = ref({
	name: '',
	brand: '',
	company: '',
	address: '',
	scale: ''
})
const rules = {
	name: [
		{
			required: true,
			message: '请输入姓名',
			trigger: ['blur', 'change']
		}
	],
	brand: [
		{
			required: true,
			message: '请输入品牌',
			trigger: ['blur', 'change']
		}
	],
	company: [
		{
			required: true,
			message: '请输入企业名称',
			trigger: ['blur', 'change']
		}
	],
	address: [
		{
			required: true,
			message: '请输入地区',
			trigger: ['blur', 'change']
		}
	],
	scale: [
		{
			required: false,
			message: '请输入规模',
			trigger: ['blur', 'change']
		}
	]
}

const submit = () => {
	uForm.value
		.validate()
		.then(res => {
			// uni.$u.toast('校验通过')
			requestComplete()
		})
		.catch(errors => {
			uni.$u.toast('校验失败')
		})
}

// 请求完善资料
const requestComplete = async () => {
	const params = {
		name: form.value.name,
		address: form.value.address,
		brandName: form.value.brand,
		companyName: form.value.company,
		peopleSize: form.value.scale
	}
	const { code, data } = await completePersonInfo(params)
	if (code !== 200) return
	uni.$u.toast('提交成功')
	uni.$u.route('/pages/index/index')
}
</script>

<style lang="scss" scoped>
.content {
	position: relative;
	min-height: 100vh;
	padding: 30rpx 30rpx 0;
}
.form-wrap {
	margin-bottom: 70rpx;
	padding: 0 30rpx 40rpx;
	border-radius: 8rpx;
	background-color: #fff;
}
.login-btn {
	height: 95rpx;
}

::v-deep {
	.u-form-item {
		padding: 5rpx 0;
	}
}
</style>
