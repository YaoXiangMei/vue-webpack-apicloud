import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { VUEX_STATE_CHANGE } from '@/plugins/types/event'
const plugin = store => {
  store.subscribe((mutation, state) => {
    api.sendEvent({
      name: VUEX_STATE_CHANGE,
      extra: {
        mutation,
        state
      }
    })
  })
}
Vue.use(Vuex)
const modulesFiles = require.context('./modules', false, /\.js$/),
  modules = modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1'),
      value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
  }, {}),
  store = new Vuex.Store({
    strict: process.env.NODE_ENV === 'development',
    modules,
    plugins: [createPersistedState({
      paths: ['user']
    }), plugin]
  })

export default store
