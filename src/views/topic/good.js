import Vue from 'vue'
import Index from './good.vue'
window.apiready = function () {
  new Vue({
    render: h => h(Index)
  }).$mount('#root')
}
