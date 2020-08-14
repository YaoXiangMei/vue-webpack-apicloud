import Vue from 'vue'
import Index from './index.vue'
// import store from '@/store'
import { VUEX_STATE_CHANGE } from '@/plugins/types/event'

window.apiready = async function () {
  const { default: store } = await import('@/store')
  new Vue({
    store,
    render: h => h(Index)
  }).$mount('#root')
  api.addEventListener({
    name: VUEX_STATE_CHANGE
  }, ({ value: { mutation, state } }, err) => {
    store.replaceState(state)
  })
}
