<template>
  <div>
    <slot />
    <footer class="dg-f-s-14 dg-t-c-999 dg-t-a-c">
      <template v-if="requestStatus === 1">
        <p v-if="type === 'more'" class="dg-flex dg-a-i-c dg-j-c-c dg-bg-c-f5f5f5 dg-p-t-b-24">
          <span class="dg-m-l-8">加载中...</span>
        </p>
      </template>
      <template v-else-if="requestStatus === 2">
        <p v-if="!list.length" class="dg-p-32">
          {{ defaultUp.emptyText }}
        </p>
      </template>
      <p v-else-if="requestStatus === 3" class="dg-f-s-14 dg-t-c-999 dg-t-a-c dg-p-24">
        {{ list.length ? defaultUp.noMoreDataText : defaultUp.emptyText }}
      </p>
      <section v-else-if="requestStatus === 4" @click="handlerReset" class="dg-p-24">
        {{ errMsg }}
        <p class="dg-f-s-12 dg-m-t-b-12">
          点击刷新
        </p>
        <img class="dg-block dg-m-r-l-auto dg-w-h-32" src="@/assets/images/refresh/icon_refresh@3x.png">
      </section>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    api: {// 请求的接口
      type: [Function],
      required: true
    },
    rq: {// 请求参数
      type: [Object],
      required: false,
      default: () => {
        return {}
      }
    },
    down: {// 下拉的配置
      type: [Object],
      required: false,
      default () {}
    },
    up: {// 上拉的配置
      type: [Object],
      required: false,
      default () {}
    }
  },
  data () {
    return {
      requestStatus: 0, // 请求的状态 0=>未请求，1=>请求中，2=>请求成功，3=>已加载所有数据，4=>请求失败
      defaultRq: {// 默认的请求参数
        page: 1,
        limit: 15
      },
      defaultDown: {
        use: true, // 是否启用下拉刷新
        /**
       * @external params
       * @see {@link https://docs.apicloud.com/Client-API/api#46}
       * */
        refreshHeaderInfo: {}
      },
      defaultUp: {// 默认的上拉加载更过配置
        use: true, // 是否启用上拉加载更多
        emptyText: '暂无相关数据~~',
        noMoreDataText: '没有更多数据了~~',
        /**
       * @external extra
       * @see {@link https://docs.apicloud.com/Client-API/api#c9}
       * */
        extra: {
          threshold: 500
        }
      },
      list: [],
      type: 'more', // 是刷新还是加载更多
      errMsg: '' // 错误的信息
    }
  },
  watch: {
    'rq': {
      handler () {
        this.$emit('refresh')
        this.defaultRq.page = 1
        this.getList({ type: 'refresh' })
      },
      deep: true
    }
  },
  created () {
    this.defaultDown = this.$tools.merge(this.defaultDown, this.down)
    this.defaultUp = this.$tools.merge(this.defaultUp, this.up)
    this.getList()
  },
  mounted () {
    this.defaultDown.use && this.$tools.setRefreshHeaderInfo(() => {
      if (this.requestStatus === 1) { // 请求中
        // 防止加载更多中 同时下拉刷新
        if (this.type === 'more') {
          api.refreshHeaderLoadDone()
        }
        return
      }
      this.$emit('refresh')
      this.defaultRq.page = 1
      this.getList({ type: 'refresh' })
    }, this.defaultDown.refreshHeaderInfo)
    this.defaultUp.use && this.scrolltobottom()
  },
  methods: {
    async getList ({ type = 'more' } = {}) { // type=more是加载更多，type=refresh是刷新
      if (this.requestStatus === 1) return // 请求过程中return掉
      this.requestStatus = 1
      this.errMsg = ''
      let params = Object.assign(this.defaultRq, this.rq, { page: this.defaultRq.page }) // 不支持传page进来，因为我们要深度监听rq，一有变化刷新列表
      this.type = type
      try {
        let { data } = await this.api(params)
        this.list = this.type === 'refresh' ? data : this.list.concat(data)
        this.$emit('change', {
          data: this.list,
          rq: params
        })
        this.requestStatus = 2
        if (data && data.length < this.defaultRq.limit) { // 已经加载全部了
          // 移除事件监听
          this.requestStatus = 3
          api.removeEventListener({ name: 'scrolltobottom' })
        }
      } catch ({ msg, message }) {
        this.requestStatus = 4
        this.errMsg = msg || message
        api.toast({ msg: msg || message || '获取数据失败', location: 'middle' })
      } finally {
        if (this.type == 'refresh') {
          api.refreshHeaderLoadDone()
          this.scrolltobottom()
        }
      }
    },
    scrolltobottom () {
      api.addEventListener({
        name: 'scrolltobottom',
        extra: this.defaultUp.extra
      }, (ret, err) => {
        if (this.requestStatus === 1 || this.requestStatus === 3) return
        this.defaultRq.page++
        this.getList()
      })
    },
    handlerReset () {
      this.defaultRq.page = 1
      this.getList({ type: 'refresh' })
    }
  }
}
</script>
