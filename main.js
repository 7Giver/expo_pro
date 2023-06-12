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

  // 引入请求封装，将app参数传递到配置中
  import('/config/request.js')
  import('/config/permission.js')

  app.use(store).use(uviewPlus)
  return {
    app
  }
}
// #endif