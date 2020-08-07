import Vue from 'vue'
import Index from './index_frame.vue'
window.apiready = function () {
  new Vue({
    render: h => h(Index)
  }).$mount('#root')
}
