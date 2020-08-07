import axios from 'axios'
import qs from 'qs'
// 拦截器
const METHODS = ['post', 'put', 'patch']
axios.interceptors.request.use(config => {
  if (!METHODS.includes(config.method)) {
    config.params = qs.parse(config.params)
  }
  return config
}, err => {
  return Promise.reject(err)
})
// 响应拦截器
axios.interceptors.response.use(res => {
  if (res.status == 200 && res.data.success) {
    return Promise.resolve(res.data)
  } else {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(res)
  }
}, err => {
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject(err)
})

export default {
  safeArea: {
    top: 0,
    bottom: 0
  },
  toast: ({ msg, message }) => alert(msg || message),
  openWin: () => {},
  closeWin: () => {},
  openFrame: () => {},
  openFrameGroup: () => {},
  setFrameGroupIndex: () => {},
  setRefreshHeaderInfo: () => {},
  addEventListener: () => {},
  getPrefs: () => {},
  setPrefs: () => {},
  sendEvent: () => {},
  ajax: async (params, cb) => {
    try {
      const { method, url, data: { body } } = params,
        data = await axios[method](url, METHODS.includes(method) ? body : { params: body })
      cb(data)
    } catch (err) {
      cb(null, err)
    }
  }
}
