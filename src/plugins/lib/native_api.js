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
  return Promise.reject(JSON.parse(err.request.response))
})

const api = {
    safeArea: {
      top: 0,
      bottom: 0
    },
    toast: ({ msg, message }) => alert(msg || message),
    openWin: (params) => {
      const { origin } = location,
        { url, pageParam } = params,
        win = window.parent || window
      let href = `${origin}/${url}`
      if (pageParam) {
        href = `${href}?${qs.stringify(pageParam)}`
      }
      win.location.href = href
    },
    closeWin: () => {
      window.history.length >= 1 && history.go(-1)
    },
    openFrame: (params) => {
      console.log(params)
      const { origin } = location,
        { url, y = 0, h = 0, pageParam } = params,
        iframe = document.createElement('iframe'),
        { width, height } = window.screen
      iframe.setAttribute('width', `${width}px`)
      iframe.setAttribute('height', `${height - y - h}px`)
      iframe.style.border = 'none'
      let src = `${origin}/${url}`
      if (pageParam) {
        src = `${src}?${qs.stringify(pageParam)}`
      }
      iframe.src = src
      document.body.appendChild(iframe)
    },
    openFrameGroup: (params) => {
      let { frames, index = 0, name, rect: { w = api.winWidth, h = api.winHeight } } = params,
        div = document.createElement('div'),
        { origin } = location
      div.setAttribute('class', name)
      w = w === 'auto' ? api.winWidth : w
      h = h === 'auto' ? api.winHeight : h
      frames.forEach(({ url, pageParam }, i) => {
        const iframe = document.createElement('iframe')
        iframe.setAttribute('width', `${w}px`)
        iframe.setAttribute('height', `${h}px`)
        iframe.style.display = index == i ? 'block' : 'none'
        let src = `${origin}/${url}`
        if (pageParam) {
          src = `${src}?${qs.stringify(pageParam)}`
        }
        iframe.src = src
        iframe.style.border = 'none'
        div.appendChild(iframe)
      })
      document.body.appendChild(div)
    },
    setFrameGroupIndex: ({ name, index }) => {
      const iframes = document.querySelectorAll(`.${name} iframe`)
      iframes.forEach((iframe, i) => {
        iframe.style.display = index == i ? 'block' : 'none'
      })
    },
    setRefreshHeaderInfo: () => {},
    addEventListener: (params, cb) => {
    // 滑动到底部
      if (params.name === 'scrolltobottom') {
        const threshold = params.extra?.threshold || 0
        window.addEventListener('scroll', () => {
          window.pageYOffset + window.screen.height + threshold >= document.body.clientHeight && cb()
        })
      } else { // 其它自定义消息
        window.addEventListener('message', ({ data }) => {
          if (!data || !data.name) return
          // eslint-disable-next-line standard/no-callback-literal
          cb({ value: data.extra })
        }, false)
      }
    },
    getPrefs: ({ key }) => {
      return localStorage.getItem(key)
    },
    setPrefs: ({ key, value }) => {
      localStorage.setItem(key, value)
    },
    removePrefs: ({ key }) => {
      localStorage.removeItem(key)
    },
    pageParam: (() => {
      return qs.parse(location.search, { ignoreQueryPrefix: true }) || {}
    })(),
    sendEvent: (params) => {
      const iframes = window.parent.document.querySelectorAll(`iframe`)
      iframes.forEach((iframe) => {
        iframe.contentWindow.postMessage(params)
      })
    },
    winWidth: (() => {
      return window.screen.width
    })(),
    winHeight: (() => {
      return window.screen.height
    })(),
    ajax: async (params, cb) => {
      try {
        const { method, url, data: { body }, headers } = params,
          data = METHODS.includes(method)
            ? await axios[method](url, body, { headers })
            : await axios[method](url, { params: body, headers })
        cb(data)
      } catch (err) {
        cb(null, err)
      }
    }
  },
  // 代理一下api对象，调用没有被写到api对象中的属性或者方法也不会报错
  proxyApi = new Proxy(api, {
    get (target, propKey, receiver) {
      if (!target[propKey]) {
        return function () {
          return receiver
        }
      }
      return Reflect.get(target, propKey, receiver)
    }
  })
export default proxyApi
