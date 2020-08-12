import Vue from 'vue'
import 'amfe-flexible'
import '@/styles/common.scss'
import tools from '@/plugins/tools'
import '@/plugins/lib/api'
import Nav from '@/components/nav'
Vue.component('Nav', Nav)
Vue.config.silent = false
Vue.config.devtools = false
Object.assign(Vue.prototype, {
  $tools: tools
})
// 浏览器环境没有apiready事件，这里监听load事件执行apiready事件，开启浏览器中预览
if (process.env.NODE_ENV === 'development') {
  const platform = window.navigator.platform
  // 浏览器上打开页面
  if (platform.includes('Win') || platform.includes('Mac')) {
    window.addEventListener('load', async () => {
      typeof api === 'undefined' && ({ default: window.api } = await import('@/plugins/lib/native_api.js'))
      window.apiready()
    })
  }
}
