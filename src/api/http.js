import tools from '@/plugins/tools'
import qs from 'qs'
const { VUE_APP_API_BASE } = process.env,
  METHODS = ['post', 'put', 'patch']
class Request {
  BASE_URL = VUE_APP_API_BASE
  DEFAULT_METHOD = 'get'
  headers = {}
  request (config = {}) {
    let {
        baseURL = this.BASE_URL,
        method = this.DEFAULT_METHOD,
        data: dataParams = {},
        params = {}
      } = config,
      data = {}
    method = method.toLowerCase()
    let url = `${baseURL}${config.url}`
    if (METHODS.includes(method)) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      data.body = qs.stringify(dataParams)
    } else {
      // data.values = params
      data.body = qs.stringify(params, { arrayFormat: 'brackets',
        encoder: (str) => {
          return str
        } })
      /**
       * @description detele没法带参数, 拼接在地址后面
       * @see {@link=https://community.apicloud.com/bbs/thread-127551-1-672.html}
       */
      url = method === 'delete' ? `${url}?${qs.stringify(params)}` : url
    }
    return new Promise((resolve, reject) => {
      api.ajax({
        url,
        method,
        headers: this.headers,
        data,
        timeout: 10,
        cache: false
      }, function (ret, err) {
        if (ret) {
          let { status, success } = ret
          status == 1 || success ? resolve(ret) : reject(ret)
        } else {
          reject(err)
        }
      })
    })
  }
}
['delete', 'get', 'head', 'options'].forEach(function (method) {
  Request.prototype[method] = function (url, config) {
    return this.request(tools.merge(config || {}, {
      method: method,
      url: url
    }))
  }
})
METHODS.forEach(function (method) {
  Request.prototype[method] = function (url, data, config) {
    return this.request(tools.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }))
  }
})
export default new Request()
