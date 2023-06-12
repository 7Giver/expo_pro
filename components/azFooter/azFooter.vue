<template>
	<view class="az-footer" v-if="!props.fixed">技术支持：{{ title }}</view>
	<view class="az-footer fixed" v-else>技术支持：{{ title }}</view>
</template>

<script>
import { defineComponent } from 'vue'
import { ref } from 'vue'

export default defineComponent({
	name: 'azFooter',
	props: {
		fixed: { type: Boolean, default: false }
	},
	setup(props) {
		const title = ref('阿中软件')
		return {
			title,
			props
		}
	}
})
</script>

<style lang="scss" scoped>
.az-footer {
	color: #999;
	font-size: 26rpx;
	text-align: center;
}
.fixed {
	position: absolute;
	left: 50%;
	bottom: 7%;
	transform: translate(-50%, 0);
}
</style>
