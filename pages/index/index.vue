<template>
	<view class="content dataAnalyse">
		<view class="wrap" style="padding: 0">
			<u-swiper
				:list="bannerList"
				keyName="picPath"
				:height="170"
				indicatorMode="dot"
				indicator
			></u-swiper>
		</view>
		<view class="btn-wrap">
			<u-button class="login-btn" type="primary" size="large" @click="submit">去订货</u-button>
		</view>
		<!-- <view class="wrap top-wrap">
			<view
				class="flex-cc item"
				v-for="(item, index) in topWarpList"
				:key="index"
				@tap.native="goTopDetail(item.url)"
			>
				<view class="flex-cc icon-wrap">
					<u-icon :name="item.icon" color="#fff" size="28"></u-icon>
				</view>
				<text>{{ item.title }}</text>
			</view>
		</view> -->
		<view class="header">
			<u-subsection
				:list="list"
				:current="current"
				@change="sectionChange"
				mode="subsection"
			></u-subsection>
			<u-tabs :list="tabsList" :current="tabsIndex" @click="tabsClick"></u-tabs>
		</view>

		<!-- 营业额排行 -->
		<view class="wrap turnover">
			<view class="tips">订货额排行</view>
			<view class="inner" v-if="turnoverRank.length">
				<view class="flex-ac item" v-for="(item, index) in turnoverRank" :key="index">
					<view class="left">
						<view class="percent">{{ item.goodsName }}</view>
						<u-line-progress
							:percentage="(item.totalMoney / turnoverRank[0].totalMoney) * 100"
							:height="10"
							:showText="false"
							activeColor="#3c9cff"
							inactiveColor="#f3f4f6"
						></u-line-progress>
					</view>
					<view class="number">¥{{ item.totalMoney }}</view>
				</view>
				<view
					class="flex-center show_more"
					style="padding-top: 24rpx"
					v-if="turnoverRank.length"
					@tap.stop="goTurnoverRank"
				>
					<text>查看更多</text>
					<u-icon name="arrow-down" color="#3c9cff" size="14"></u-icon>
				</view>
			</view>
			<view class="nodata" v-else>暂无数据</view>
		</view>

		<!-- 销量排行 -->
		<view class="wrap volume">
			<view class="tips">销量排行</view>
			<view class="inner" v-if="volumeRank.length || !hasToken">
				<view class="charts-box">
					<qiun-data-charts
						type="ring"
						canvasId="myCanvas"
						:canvas2d="true"
						:opts="opts"
						:ontap="false"
						:tapLegend="false"
						:chartData="chartData"
					/>
				</view>
				<view class="table">
					<view class="top">
						<text class="name" style="flex: 3">商品名称</text>
						<text class="unit" style="flex: 1">单位</text>
						<text class="number" style="flex: 1.5">销量数量</text>
						<!-- <text>销售金额</text> -->
					</view>
					<view class="item" v-for="(item, index) in volumeRanks" :key="index">
						<text class="name" style="flex: 3">{{ item.goodsName }}</text>
						<text class="unit" style="flex: 1">{{ item.measureUnit }}</text>
						<text class="number" style="flex: 1.5">{{ item.totalNumber.toFixed(0) }}</text>
						<!-- <text>{{ item.totalMoney }}</text> -->
					</view>
				</view>
				<view
					class="flex-center show_more"
					style="padding-top: 24rpx"
					v-if="volumeRank?.length"
					@tap.stop="goVolumeRank"
				>
					<text>查看更多</text>
					<u-icon name="arrow-down" color="#3c9cff" size="14"></u-icon>
				</view>
			</view>
			<view class="nodata" v-else>暂无数据</view>
		</view>

		<!-- 订货排行 -->
		<view class="wrap">
			<view class="tips">订货排行</view>
			<view class="rank_wrap" v-if="supplyRank.length">
				<view class="flex-cb item_wrap" v-for="(item, index) in supplyRank" :key="index">
					<view class="rank">{{ index + 1 }}</view>
					<view class="right_wrap">
						<view class="flex-cb top">
							<view class="u-line-1 title">{{ item.goodsName }}</view>
							<view class="flex-bc right">
								<view class="u-line-1 order"
									>{{ item.totalNumber || 0 }}{{ item.measureUnit || '' }}</view
								>
								<view class="cash">¥{{ item.totalMoney || 0 }}</view>
							</view>
						</view>
						<view class="bottom">
							<u-line-progress
								height="10"
								:showText="false"
								:percentage="(item.totalNumber / supplyRank[0].totalNumber) * 100"
								activeColor="#3c9cff"
								inactiveColor="#f3f4f6"
							>
							</u-line-progress>
						</view>
					</view>
				</view>
				<view
					class="flex-center show_more"
					style="padding-top: 24rpx"
					v-if="supplyRank?.length"
					@tap.stop="goRankList"
				>
					<text>查看更多</text>
					<u-icon name="arrow-down" color="#3c9cff" size="14"></u-icon>
				</view>
			</view>
			<view class="nodata" v-else>暂无数据</view>
		</view>

		<!-- 更多分析 -->
		<view class="wrap" @click="goMoreAnalysis">
			<view class="flex-center show_more" style="padding-top: 30rpx">
				<text>更多分析</text>
				<u-icon name="arrow-right" color="#3c9cff" size="14"></u-icon>
			</view>
		</view>

		<!-- 客户picker -->
		<u-picker
			:show="showPicker"
			:columns="columns"
			:immediateChange="true"
			title="选择发货客户"
			keyName="name"
			@cancel="showPicker = false"
			@confirm="pickerConfirm"
		></u-picker>

		<!-- 仓库picker -->
		<u-picker
			:show="showWarehouse"
			:columns="warehouseList"
			:immediateChange="true"
			title="选择销售仓库"
			keyName="warehouseName"
			@cancel="showWarehouse = false"
			@confirm="pickerConfirm"
		></u-picker>

		<!-- 首页广告图 -->
		<!-- <u-popup
			:show="showBanner"
			:closeOnClickOverlay="false"
			:safeAreaInsetTop="true"
			mode="center"
			bgColor="transparent"
			@close="showBanner = false"
		>
			<view class="banner-wrap" @click="goLogin">
				<image mode="aspectFill" src="/static/index.jpg"></image>
			</view>
		</u-popup> -->
		<!-- 操作拟态框 -->
		<u-modal
			:show="showModal"
			title="提示"
			width="600rpx"
			:content="content"
			:showCancelButton="true"
			@confirm="showModal = false"
			@cancel="showModal = false"
		></u-modal>
		<!-- 悬浮跳转按钮 -->
		<!-- <view class="achina_fixed_btn" @tap.stop="goSendOrder()">去销售</view> -->
		<AzFooter></AzFooter>
		<!-- 底部tabbar -->
		<tabbar :tabbarIndex="0"></tabbar>
	</view>
</template>

<script setup>
import { onShow, onReady } from '@dcloudio/uni-app'
import { ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import common from '@/libs/common'
import {
	listDaySaleMoneyOrder,
	listDaySaleNumberOrder,
	listDaySupplyNumberOrder,
	getBannerList
} from '@/config/api.js'
import AzFooter from '@/components/azFooter/azFooter.vue'

onReady(() => {
	resultDateRangeList()
	requestBannerList()
	init()
})

onBeforeMount(() => {
	let title = userInfo.value.systemName ? `${userInfo.value.systemName}首页` : '首页'
	uni.setNavigationBarTitle({
		title: title
	})
})

const store = useStore()
const showPicker = ref(false)
const showModal = ref(false)
const showBanner = ref(false)
const content = ref('')
const current = ref(0)
const list = ref(['月报', '日报'])
const tabsIndex = ref(0)
const tabsList = ref([])
const dateRange = ref([])
const chartData = ref({})
const topWarpList = ref([
	{ title: '数据中心', icon: 'bookmark-fill', url: '/pages/data/center' },
	{ title: '订货单', icon: 'grid-fill', url: '/pages/purchase/purchase' },
	{ title: '收货单', icon: 'shopping-cart-fill', url: '/pages/receipt/receipt' },
	{ title: '库存管理', icon: 'list-dot', url: '/pages/store/store' },
	{ title: '销售单', icon: 'rmb-circle-fill', url: '/pages/delivery/delivery' },
	{ title: '退货单', icon: 'reload', url: '/pages/return/return' },
	{ title: '预警设置', icon: 'calendar-fill', url: '/pages/user/warnManage' },
	{ title: '我的', icon: 'account-fill', url: '/pages/user/user' }
])
const turnoverRank = ref([
	{ goodsName: '雪山芝士4寸原味(甜沫)', totalMoney: 34445 },
	{ goodsName: '缤纷迷你彩虹蛋糕', totalMoney: 23456 },
	{ goodsName: '4粒装流星花花马卡龙糕点', totalMoney: 12000 },
	{ goodsName: '莓果蛋糕', totalMoney: 6577 },
	{ goodsName: '3粒装原味半熟芝士', totalMoney: 988 }
])
const volumeRank = ref([
	{ goodsName: '华东大区', measureUnit: '件', totalNumber: 980, totalMoney: 12000 },
	{ goodsName: '华北大区', measureUnit: '件', totalNumber: 764, totalMoney: 23456 },
	{ goodsName: '华中大区', measureUnit: '件', totalNumber: 230, totalMoney: 34445 },
	{ goodsName: '华南大区', measureUnit: '件', totalNumber: 120, totalMoney: 6577 },
	{ goodsName: '西南大区', measureUnit: '件', totalNumber: 68, totalMoney: 988 }
])
const supplyRank = ref([
	{
		id: 1,
		goodsName: '华东大区',
		totalNumber: 2300,
		totalMoney: 9800,
		planSaleMoney: 27800000
	},
	{
		id: 2,
		goodsName: '华北大区',
		totalNumber: 1800,
		totalMoney: 7645,
		planSaleMoney: 27800000
	},
	{
		id: 3,
		goodsName: '华中大区',
		totalNumber: 900,
		totalMoney: 2300,
		planSaleMoney: 27800000
	},
	{
		id: 4,
		goodsName: '西南大区',
		totalNumber: 500,
		totalMoney: 680,
		planSaleMoney: 27800000
	}
]) // 排行数据
const opts = {
	rotate: false,
	rotateLock: false,
	color: [
		'#1890FF',
		'#91CB74',
		'#FAC858',
		'#EE6666',
		'#73C0DE',
		'#3CA272',
		'#FC8452',
		'#9A60B4',
		'#ea7ccc'
	],
	padding: [5, 5, 5, 5],
	dataLabel: true,
	legend: {
		show: false,
		position: 'bottom',
		lineHeight: 25
	},
	title: {
		name: ' ',
		fontSize: 15,
		color: '#666666'
	},
	subtitle: {
		name: ' ',
		fontSize: 25,
		color: '#7cb5ec'
	},
	extra: {
		ring: {
			ringWidth: 40,
			activeOpacity: 0.5,
			activeRadius: 10,
			offsetAngle: 0,
			labelWidth: 12,
			border: true,
			centerColor: '#FFFFFF',
			borderWidth: 3,
			borderColor: '#FFFFFF',
			linearType: 'custom'
		}
	}
}
const showWarehouse = ref(false)
const warehouseList = ref([])
const hasToken = computed(() => store.getters.hasToken)
const userInfo = computed(() => store.state.userInfo)
const bannerList = ref([])
// 获取客户picker处理数据
const columns = computed(() => store.getters.getCustomerList)

const volumeRanks = computed(() => {
	let list = volumeRank.value
	if (!list || !list.length) return []
	if (list.length <= 5) return list
	let sortList = list.sort((a, b) => b.totalNumber - a.totalNumber).slice(0, 5)
	let total = list.slice(5).reduce((a, b) => (a = a + b.totalNumber), 0)
	sortList.push({ goodsName: '其他', measureUnit: '个', totalNumber: total })
	return sortList
})

const init = () => {
	if (hasToken.value) {
		getDaySaleMoneyOrder()
		getDaySaleNumberOrder()
		getDaySupplyNumberOrder()
	} else {
		// showBanner.value = true
		getServerData()
	}
}

// 加载uCharts
const getServerData = () => {
	let showData = [
		{ name: '华东大区', value: 9800 },
		{ name: '华北大区', value: 7645 },
		{ name: '华中大区', value: 2300 },
		{ name: '华南大区', value: 1200 },
		{ name: '西南大区', value: 680 }
	]
	let chartList = []
	// console.log('volumeRank', volumeRank.value);
	// hasToken.value ? (chartList = volumeRank.value) : (chartList = showData)
	chartList = volumeRank.value.map(item => {
		return {
			name: item.goodsName,
			value: item.totalNumber
		}
	})
	let dataList = resultSortList(chartList)
	function initData() {
		let res = {
			series: [{ data: dataList }]
		}
		chartData.value = JSON.parse(JSON.stringify(res))
		// console.log('chartData', chartData.value)
	}
	setTimeout(() => {
		initData()
	}, 300)
}

// 输出排序数据
const resultSortList = list => {
	if (!list || !list.length) return []
	if (list.length <= 5) return list
	let sortList = list.sort((a, b) => b.value - a.value).slice(0, 5)
	let total = list.slice(5).reduce((a, b) => (a = a + b.value), 0)
	sortList.push({ name: '其他', value: total })
	return sortList
}

const sectionChange = index => {
	current.value = index
	resultDateRangeList()
	init()
}

const tabsClick = e => {
	// console.log('tabsClick', e)
	tabsIndex.value = e.index
	dateRange.value = e.value
	init()
}

const resultDateRangeList = () => {
	let result = []
	current.value == 1 ? (result = resultDateList()) : (result = resultMonthList())
	tabsIndex.value = result.length - 1
	dateRange.value = result[tabsIndex.value].value
	tabsList.value = result
}

// 处理日期tabs
const resultDateList = () => {
	let date1 = new Date()
	let arr = []
	for (var i = 0; i < 30; i++) {
		var date2 = new Date(date1.getTime() - i * 24 * 60 * 60 * 1000)
		var date3 = new Date(date1.getTime() - (i - 1) * 24 * 60 * 60 * 1000)
		let temp = {
			name: common.getTime6(date2),
			value: [
				`${uni.$u.timeFormat(date2, 'yyyy-mm-dd')} 00:00:00`,
				`${uni.$u.timeFormat(date3, 'yyyy-mm-dd')} 00:00:00`
			]
		}
		arr.push(temp)
	}
	return arr.reverse()
}

// 处理月份tabs
const resultMonthList = () => {
	var dataArr = []
	var data = new Date()
	data.setMonth(data.getMonth() + 1, 1) //获取到当前月份,设置月份
	for (var i = 0; i < 12; i++) {
		data.setMonth(data.getMonth() - 1) //每次循环一次 月份值减1
		var m = data.getMonth() + 1
		var y = data.getMonth() + 2
		m = m < 10 ? '0' + m : m
		y = y < 10 ? '0' + y : y
		let str = data.getFullYear() + '-' + m
		let str1 = data.getFullYear() + '-' + y
		let temp = {
			name: str,
			value: [`${str}-01 00:00:00`, `${str1}-01 00:00:00`]
		}
		dataArr.push(temp)
	}
	return dataArr.reverse()
}

const goTurnoverRank = () => {
	uni.$u.route({
		url: '/pages/data/turnoverRank',
		params: {
			current: current.value,
			tabsIndex: tabsIndex.value
		}
	})
}

const goVolumeRank = () => {
	uni.$u.route({
		url: '/pages/data/volumeRank',
		params: {
			current: current.value,
			tabsIndex: tabsIndex.value
		}
	})
}

// 跳转发货排行
const goRankList = () => {
	uni.$u.route({
		url: '/pages/data/demandRank',
		params: {
			current: current.value,
			tabsIndex: tabsIndex.value
		}
	})
}

const goMoreAnalysis = () => {
	uni.navigateTo({
		url: '/pages/data/center'
	})
}

const goLogin = () => {
	uni.reLaunch({ url: '/pages/login/login' })
}

const goSendOrder = () => {
	// if (!hasToken.value) {
	// 	uni.$u.toast('请先登录')
	// 	uni.reLaunch({
	// 		url: '/pages/user/user'
	// 	})
	// 	return
	// }
	// if (columns.value[0].length < 1) {
	// 	uni.$u.toast('暂无客户')
	// 	return
	// }
	const warehouseList = store.state.warehouseList
	if (warehouseList.length < 1) {
		uni.$u.toast('暂无仓库')
		return
	}
	// showPicker.value = true
	showWarehouse.value = true
}

// picker确认
const pickerConfirm = ({ value }) => {
	// console.log('value', value);
	let target = value[0]
	store.commit('setWarehouse', target)
	store.commit('clearSendCart', target)
	uni.navigateTo({
		url: `/pages/delivery/index-copy`
	})
	showWarehouse.value = false
}

// 顶部路由跳转
const goTopDetail = url => {
	if (!url) {
		uni.$u.toast('敬请期待')
		return
	}
	uni.$u.route(url)
}

// 获取营业额
const getDaySaleMoneyOrder = async () => {
	const params = {
		dealerId: store.state.userInfo.dealerUuid,
		startTime: dateRange.value[0],
		endTime: dateRange.value[1],
		pageNum: 1,
		pageSize: 9999
	}
	const { code, data } = await listDaySaleMoneyOrder(params)
	if (code !== 200) return
	// console.log('getDaySaleMoneyOrder', data)
	turnoverRank.value = data.slice(0, 5)
}

// 获取销量排行
const getDaySaleNumberOrder = async () => {
	const params = {
		dealerId: store.state.userInfo.dealerUuid,
		startTime: dateRange.value[0],
		endTime: dateRange.value[1],
		pageNum: 1,
		pageSize: 9999
	}
	const { code, data } = await listDaySaleNumberOrder(params)
	if (code !== 200) return
	// console.log('getDaySaleNumberOrder', data)
	volumeRank.value = data
	getServerData()
}

// 订货排行
const getDaySupplyNumberOrder = async () => {
	const params = {
		dealerId: store.state.userInfo.dealerUuid,
		startTime: dateRange.value[0],
		endTime: dateRange.value[1],
		pageNum: 1,
		pageSize: 9999
	}
	const { code, data } = await listDaySupplyNumberOrder(params)
	if (code !== 200) return
	// console.log('getDaySupplyNumberOrder', data)
	supplyRank.value = data.slice(0, 5)
}

// banner海报
const requestBannerList = async () => {
	const { code, data } = await getBannerList()
	if (code !== 200) return
	bannerList.value = data
}

const submit = () => {}
</script>

<style lang="scss" scoped>
.dataAnalyse {
	position: relative;
	min-height: 100%;
	padding-top: 30rpx;
	padding-bottom: 80rpx;
	.wrap {
		padding: 0 0 30rpx;
		margin: 0 30rpx 30rpx;
		background-color: #fff;
		border-radius: 16rpx;
	}
	.tips {
		font-size: 32rpx;
		line-height: 84rpx;
		font-weight: 700;
		padding-left: 30rpx;
		border-bottom: 1px solid #e1e1e1;
	}
	.top-wrap {
		display: flex;
		flex-wrap: wrap;
		padding: 30rpx 0 0rpx;
		.item {
			// flex: 1;
			width: 25%;
			padding-bottom: 20rpx;
			.icon-wrap {
				width: 110rpx;
				height: 110rpx;
				border-radius: 50%;
				background-color: $u-primary;
			}
			text {
				font-size: 28rpx;
				text-align: center;
				padding-top: 8rpx;
			}
		}
	}
	.header {
		padding: 30rpx 30rpx 12rpx;
		background-color: #fff;
		margin-bottom: 30rpx;
	}
	.charts-box {
		width: 100%;
		height: 540rpx;
	}
	.turnover {
		.inner {
			padding: 0 30rpx;
			.item {
				padding-top: 16rpx;
				.left {
					width: 82%;
					.percent {
						margin-bottom: 8rpx;
						font-size: 30rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.u-line-progress {
						flex: 1;
					}
				}
				.number {
					flex: 1;
					color: $u-error;
					font-size: 28rpx;
					text-align: right;
					padding-left: 20rpx;
				}
			}
		}
	}
}
.volume {
	.table {
		padding: 0 30rpx;
		.top {
			display: flex;
			align-items: center;
			justify-content: space-around;
			background-color: #fafafa;
			padding: 0 20rpx;
			text {
				color: #999;
				text-align: left;
				font-size: 26rpx;
				line-height: 65rpx;
			}
			.unit,
			.number {
				text-align: right;
			}
		}
		.item {
			display: flex;
			align-items: center;
			justify-content: space-around;
			&:not(:last-child) {
				border-bottom: 1px solid #eee;
			}
			padding: 0 20rpx;
			text {
				flex: 1;
				color: #333;
				font-size: 30rpx;
				line-height: 80rpx;
			}
			.name {
				text-align: left;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.unit,
			.number {
				text-align: right;
			}
			.number {
				color: $u-primary;
			}
		}
	}
}
.rank_wrap {
	padding: 0 30rpx;
	.item_wrap {
		padding: 18rpx 0 0;
		background: #fff;
		// margin-bottom: 20rpx;
		.rank {
			width: 20rpx;
			margin-right: 30rpx;
		}
		.right_wrap {
			flex: 1;
			.top {
				.title {
					font-size: 30rpx;
				}
				.order {
					color: #666;
					font-size: 26rpx;
					margin-right: 20rpx;
				}
				.cash {
					color: $u-error;
					text-align: right;
					font-size: 28rpx;
					min-width: 110rpx;
				}
			}
			.bottom {
				margin-top: 12rpx;
			}
		}
	}
}
.show_more {
	width: 100%;
	color: $u-primary;
	font-size: 28rpx;
	text-align: center;
	.u-icon {
		margin-left: 4rpx;
	}
}
.banner-wrap {
	height: 80vh;
	image {
		// width: 100%;
		height: 100%;
	}
}
.btn-wrap {
	padding: 20rpx 30rpx 50rpx;
	.login-btn {
		height: 95rpx;
	}
}
</style>
