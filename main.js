import App from './App'
import uviewPlus from '@/uni_modules/uview-plus'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import store from './store'

export function createApp() {
  const app = createSSRApp(App)

  // 初始化请求配置
  uni.$u.http.setConfig(config => {
    // config.baseURL = 'http://47.100.230.131:8081'
    // config.baseURL = 'http://192.168.10.15:8081'
    config.baseURL = 'https://crmmanage-dev.achina.xin'
    config.header.Authorization = store.state.token
    return config
  })

  // 请求拦截
  uni.$u.http.interceptors.request.use(
    config => {
      config.data = config.data || {}
      return config
    },
    config => {
      return Promise.reject(config)
    }
  )

  // 响应拦截
  uni.$u.http.interceptors.response.use(
    response => {
      const data = response.data
      // 自定义参数
      const custom = response.config?.custom
      if (data.code === 401) {
        uni.$u.toast('请先登录')
        store.dispatch('loginOut')
      }
      if (data.code !== 200) {
        // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
        if (custom.toast !== false) {
          uni.$u.toast(data.message)
          return Promise.resolve(data)
        }
        // 如果需要catch返回，则进行reject
        if (custom?.catch) {
          return Promise.reject(data)
        } else {
          return new Promise(() => { })
        }
      }
      return data.data === undefined ? {} : data
    },
    response => {
      // console.log('response', response)
      if (response.statusCode === 401) {
        uni.$u.toast('请先登录')
        store.dispatch('loginOut')
      }
      return Promise.reject(response)
    }
  )

  app.use(store).use(uviewPlus)
  return {
    app
  }
}
// #endif