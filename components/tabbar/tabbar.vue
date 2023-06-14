<template>
	<u-tabbar :value="tabbarIndex" :fixed="true" :placeholder="true" @change="tabbarChange">
		<u-tabbar-item
			v-for="(tab, index) in tabbarList"
			:key="index"
			:text="tab.name"
			:icon="tab.icon"
		></u-tabbar-item>
	</u-tabbar>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
	tabbarIndex: {
		type: Number,
		default: 0
	}
})

const tabbarList = [
	{
		name: '首页',
		icon: 'home',
		path: '/pages/index/index'
	},
	{
		name: '订货',
		icon: 'grid',
		path: '/pages/purchase/purchase'
	},
	// {
	// 	name: '收货单',
	// 	icon: 'shopping-cart',
	// 	path: '/pages/receipt/receipt'
	// },
	// {
	// 	name: '库存管理',
	// 	icon: 'list-dot',
	// 	path: '/pages/store/store'
	// },
	{
		name: '我的',
		icon: 'account',
		path: '/pages/user/user'
	}
]

const tabbarChange = idx => {
	// console.log('tabbarChange', idx)
	uni.reLaunch({
		url: tabbarList[idx].path
	})
}
</script>

<style></style>
