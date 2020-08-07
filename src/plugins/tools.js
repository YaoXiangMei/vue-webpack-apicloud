
const tools = {
  /**
   * 实现类似 laravel Arr类中的数组操作，因为js中对象操作更方便，所以改为对象操作，另外，json序列化时数组非数字key会丢失
  * @example set({},'a.b.c','ddd') => {a:b:{c:'ddd'}}
  * @param {Object} array 被操作对象
  * @param {String} key key值
  * @param {Object} value 设置后返回值（因为js无法实现函数的传值引用，所以只能返回值再从函数外重新设置）
  */
  set (array, key, value) {
    let arr = array, // 实现传值引用(指针指向同一地址)
      keys = key.split('.')
    while (keys.length > 1) {
      key = keys.shift()
      if (!arr.hasOwnProperty(key) || !(arr[key] instanceof Object)) {
        arr[key] = {}
      }
      arr = arr[key] // php 请使用 $array = &$array[$key] （arr指针指向了array的子对象）
    }
    arr[keys.shift()] = value
    return array
  },
  /**
   * @see {@link=https://docs.apicloud.com/Client-API/api#setPrefs}
  * @param  {string} key - 键名
  * @param  {*} value - 键值
  * @param  {number} time - 过期时间 单位是时间戳毫秒
  */
  setPrefs (key, value, time) {
    if (time && time.toString().length !== 13) throw new Error('过期时间只支持毫秒数')
    let length = arguments.length
    if (length <= 1) return
    let names = key.split('.'),
      name = names.shift(),
      storeStr = api.getPrefs({ sync: true, key: name }) || {},
      store = {}
    try {
      store = JSON.parse(storeStr)
    } catch {
      store = {
        data: storeStr,
        __endTime: 0
      }
    }
    if (time) {
      store.__endTime = time
    }
    if (names.length === 0) {
      store.data = value
    } else {
      let realName = names.join('.')
      store.data = this.set(store.data, realName, value)
    }
    store = JSON.stringify(store)
    api.getPrefs({
      key: name,
      value: store
    })
  },
  /**
   * @see {@link=https://docs.apicloud.com/Client-API/api#getPrefs}
  * @param  {string} key - 键名
  * @returns  {*}
  */
  getPrefs (key) {
    // return tools.baseGet(key, 'Prefs')
    if (!key) return null
    let timestamp = +new Date(),
      name = key.split('.')[0],
      storeStr = api.getPrefs({
        sync: true,
        key: name
      })
    try {
      let store = JSON.parse(storeStr)
      if (store.__endTime && timestamp > store.__endTime) {
        tools.removePrefs(name)
        return null
      }
      if (!store.hasOwnProperty('data')) return null
      store = store.data
      key.split('.').forEach((segment, index) => {
        if (index > 0) {
          if (store.hasOwnProperty(segment)) {
            store = store[segment]
          } else {
            store = null
          }
        }
      })
      return store
    } catch {
      return null
    }
  },
  /**
   * @param  {string} key - 键名
   */
  removePrefs (key) {
    api.removePrefs({
      key
    })
  },
  /**
   * Example:
  * var result = merge({foo: 123}, {foo: 456});
  * console.log(result.foo); // outputs 456
  * ```
  *
  * @param {Object} obj1 Object to merge
  * @returns {Object} Result of all merge properties
  */
  merge (/* obj1, obj2, obj3, ... */) {
    var result = {}
    function assignValue (val, key) {
      if (typeof result[key] === 'object' && typeof val === 'object') {
        result[key] = tools.merge(result[key], val)
      } else {
        result[key] = val
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      tools.forEach(arguments[i], assignValue)
    }
    return result
  },
  /**
   * Iterate over an Array or an Object invoking a function for each item.
  *
  * If `obj` is an Array callback will be called passing
  * the value, index, and complete array for each item.
  *
  * If 'obj' is an Object callback will be called passing
  * the value, key, and complete object for each property.
  *
  * @param {Object|Array} obj The object to iterate
  * @param {Function} fn The callback to invoke for each item
  */
  forEach (obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return
    }
    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /* eslint no-param-reassign:0 */
      obj = [obj]
    }

    if (Array.isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(obj, obj[i], i, obj)
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(obj, obj[key], key, obj)
        }
      }
    }
  },
  /**
   * @description - 连续长安两次关闭app
   */
  closeApp () {
    let flag = null
    api.addEventListener({
      name: 'keyback'
    }, (ret, err) => {
      if (!flag) {
        flag = new Date().getTime()
        api.toast({ msg: '再按一次关闭应用', location: 'middle', duration: 1500 })
        window.setTimeout(() => {
          flag = null
        }, 1500)
      } else {
        flag = null
        api.closeWidget({ silent: true })
      }
    })
  },
  /**
   * @description 对话框
  * @param { Object } options
  * @param { string } [options.title=提示]
  * @param { string } [options.msg=确定要执行此操作吗]
  * @param { array } [options.buttons=['取消', '确定']]
  * @param { number } [options.confirmIndex=2] - 确定按钮的下标，从1开始
  * @param { boolean } [options.cancelCb=false] - 是否需要reject，默认是false，也就是点了取消不触发catch
  */
  confirm ({ title = '提示', msg = '确定要执行此操作吗', buttons = ['取消', '确定'], confirmIndex = 2, cancelCb = false } = {}) {
    return new Promise((resolve, reject) => {
      api.confirm({
        title,
        msg,
        buttons
      }, ({ buttonIndex }, err) => {
        // 按下确定按钮
        if (confirmIndex == buttonIndex) {
          resolve()
        } else if (cancelCb) { // 按下取消按钮，并且外部需要知道
          reject(new Error())
        }
      })
    })
  },
  /**
   * @description 下拉刷新
  * @external params
  * @see {@link https://docs.apicloud.com/Client-API/api#46}
  * */
  setRefreshHeaderInfo (cb, { bgColor = '#F2F4F8', textColor = '#999', textDown = '下拉刷新...', textUp = '松开刷新...', textLoading = '加载中...' } = {}) {
    api.setRefreshHeaderInfo({
      // loadingImg: require('@/assets/images/refresh/icon_transparent.png'),
      bgColor,
      textColor,
      textDown,
      textUp,
      showTime: false
    }, (ret, err) => {
      ret && typeof cb === 'function' && cb()
    })
  },
  /**
  *@see {@link=https://docs.apicloud.com/Client-API/api#33}
  *@param {Object} params
  */
  openWin (params) {
    let defaultParams = tools.merge({
      useWKWebView: true, // 讨论区有人说使用UIWebView上App Store会被拒，所以用useWKWebView
      allowEdit: true,
      softInputBarEnabled: false,
      overScrollMode: 'always'
    }, params)
    api.openWin(defaultParams)
  },
  /**
  *@see {@link=https://docs.apicloud.com/Client-API/api#27}
  *@param {Object} params
  */
  openFrame (params) {
    let defaultParams = tools.merge({
      useWKWebView: true, // 讨论区有人说使用UIWebView上App Store会被拒，所以用useWKWebView
      allowEdit: true,
      softInputBarEnabled: false,
      overScrollMode: 'always'
    }, params)
    api.openFrame(defaultParams)
  },
  openFrameGroup (params, cb) {
    params.frames.forEach((item) => {
      if (typeof item.useWKWebView === 'undefined') {
        item.useWKWebView = true
      }
    })
    let defaultParams = tools.merge({
      useWKWebView: true,
      allowEdit: true
    }, params)
    api.openFrameGroup(defaultParams, cb)
  }
}
export default tools
