<template>
	<view class="lee-wrap">
		<view class="lee-menu-wrap">
			<scroll-view
				scroll-y
				scroll-with-animation
				class="lee-tab-view menu-scroll-view"
				:scroll-top="scrollTop"
				:scroll-into-view="itemId"
			>
				<view
					v-for="(item, index) in list"
					:key="index"
					class="lee-tab-item"
					:class="[current == index ? 'lee-tab-item-active' : '']"
					@tap.stop="swichMenu(index)"
				>
					<text class="u-line-1">{{ item.name }}</text>
				</view>
			</scroll-view>
			<scroll-view
				:scroll-top="scrollRightTop"
				scroll-y
				scroll-with-animation
				class="right-box"
				@scroll="rightScroll"
			>
				<view class="page-view">
					<view class="class-item" :id="'item' + index" v-for="(item, index) in list" :key="index">
						<view class="item-title">
							<text>{{ item.name }}</text>
						</view>
						<slot name="custom" :row="item">
							<view class="item-container">
								<view
									class="thumb-box"
									v-for="(item1, index1) in item.foods"
									:key="index1"
									@click="$emit('onGoodItem', item1)"
								>
									<image
										v-if="item1.icon != ''"
										class="item-menu-img"
										:src="item1.icon"
										mode=""
									></image>
									<view
										v-else
										class="item-menu-img row-c"
										style="background-color: #f4f6f8"
									>
										<text style="font-size: 20rpx; color: #d0d0d0">加载失败</text>
									</view>
									<view class="item-menu-name">{{ item1.name }}</view>
								</view>
							</view>
						</slot>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		// 数据列表
		list: {
			type: Array,
			default() {
				return []
			}
		}
	},
	data() {
		return {
			scrollTop: 0, //tab标题的滚动条位置
			oldScrollTop: 0, // tab标题的滚动条旧位置
			current: 0, // 预设当前项的值
			menuHeight: 0, // 左边菜单的高度
			menuItemHeight: 0, // 左边菜单item的高度
			itemId: '', // 栏目右边scroll-view用于滚动的id
			arr: [], // 储存距离顶部高度的数组
			scrollRightTop: 0, // 右边栏目scroll-view的滚动条高度
			timer: null
		}
	},
	mounted() {
		this.getMenuItemTop()
	},
	methods: {
		// 获取一个目标元素的高度
		getElRect(elClass, dataVal) {
			new Promise((resolve, reject) => {
				const query = uni.createSelectorQuery().in(this)
				query
					.select('.' + elClass)
					.fields(
						{
							size: true
						},
						res => {
							if (!res) {
								setTimeout(() => {
									this.getElRect(elClass)
								}, 10)
								return
							}
							this[dataVal] = res.height
							resolve()
						}
					)
					.exec()
			})
		},
		getMenuItemTop() {
			new Promise(resolve => {
				let selectorQuery = uni.createSelectorQuery().in(this)
				selectorQuery
					.selectAll('.class-item')
					.boundingClientRect(rects => {
						if (!rects.length) {
							setTimeout(() => {
								this.getMenuItemTop()
							}, 10)
							return
						}
						rects.forEach(rect => {
							this.arr.push(rect.top)
							resolve()
						})
					})
					.exec()
			})
		},
		// 设置左边菜单的滚动状态
		async leftMenuStatus(index) {
			this.current = index
			// 如果为0，意味着尚未初始化
			if (this.menuHeight == 0 || this.menuItemHeight == 0) {
				await this.getElRect('menu-scroll-view', 'menuHeight')
				await this.getElRect('lee-tab-item', 'menuItemHeight')
			}
			// 将菜单活动item垂直居中
			this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2
		},
		// 点击左边的栏目切换
		async swichMenu(index) {
			if (this.arr.length == 0) {
				await this.getMenuItemTop()
			}
			if (index == this.current) return
			this.scrollRightTop = this.oldScrollTop
			this.$nextTick(() => {
				this.scrollRightTop = this.arr[index]
				this.current = index
				this.leftMenuStatus(index)
			})
		},
		// 右边菜单滚动  如果不存在height2，意味着数据循环已经到了最后一个，设置左边菜单为最后一项即可
		async rightScroll(e) {
			this.oldScrollTop = e.detail.scrollTop
			if (this.arr.length == 0) {
				await this.getMenuItemTop()
			}
			if (this.timer) return
			if (!this.menuHeight) {
				await this.getElRect('menu-scroll-view', 'menuHeight')
			}
			setTimeout(() => {
				// 节流
				this.timer = null
				let scrollHeight = e.detail.scrollTop + 20
				for (let i = 0; i < this.arr.length; i++) {
					let height1 = this.arr[i]
					let height2 = this.arr[i + 1]
					if (!height2 || (scrollHeight >= height1 && scrollHeight < height2)) {
						this.leftMenuStatus(i)
						return
					}
				}
			}, 10)
		}
	}
}
</script>

<style lang="scss" scoped>
$lee-main-color: #101010;
$lee-left-color: $u-primary;
$lee-tab-item-active: #fff;
.lee-wrap {
	/* #ifdef H5 */
	height: calc(100vh - var(--window-top));
	/* #endif */
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.lee-menu-wrap {
	flex: 1;
	display: flex;
	overflow: hidden;
}

.lee-tab-view {
	width: 200rpx;
	height: 100%;
}

.lee-tab-item {
	height: 110rpx;
	background: #f6f6f6;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #444;
	font-weight: 400;
	line-height: 1;
}

.lee-tab-item-active {
	position: relative;
	color: $lee-left-color;
	font-size: 30rpx;
	font-weight: 500;
	background: $lee-tab-item-active;
}

.lee-tab-item-active::before {
	content: '';
	position: absolute;
	border-left: 4px solid $lee-left-color;
	height: 52rpx;
	left: 0;
	top: 29rpx;
}

.lee-tab-view {
	height: 100%;
}

.right-box {
	// background-color: rgb(250, 250, 250);
	background-color: #fff;
}

.page-view {
	padding: 16rpx;
}

.class-item {
	margin-bottom: 30rpx;
	background-color: #fff;
	padding: 16rpx;
	border-radius: 8rpx;
}

.class-item:last-child {
	min-height: 100vh;
}

.item-title {
	font-size: 32rpx;
	color: $lee-main-color;
	font-weight: bold;
}

.item-menu-name {
	margin-top: 8rpx;
	font-weight: normal;
	font-size: 24rpx;
	color: $lee-main-color;
}

.item-container {
	display: flex;
	flex-wrap: wrap;
}

.thumb-box {
	width: 33.333333%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	margin-top: 20rpx;
}

.item-menu-img {
	width: 120rpx;
	height: 120rpx;
}
</style>
