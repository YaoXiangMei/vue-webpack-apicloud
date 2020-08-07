import * as type from '../mutation-types'
import tools from '@/plugins/tools'

export default {
  namespaced: true,
  state: {
    user: {
      profile: {
        age: 1
      },
      createdAt: ''
    }
  },
  mutations: {
    [type.USER_STORE] (state, user) {
      state.user = user
    },
    [type.USER_UPDATE] (state, data) {
      let user = Object.assign({}, state.user)
      for (const k in data) {
        if (k.indexOf('.') === -1) {
          user[k] = data[k]
        } else {
          user = tools.set(user, k, data[k])
        }
      }
      state.user = user
    }
  },
  actions: {
    [type.USER_STORE] ({ commit }, user) {
      commit(type.USER_STORE, user)
    },
    [type.USER_UPDATE] ({ commit }, data) {
      commit(type.USER_UPDATE, data)
    }
  }
}
