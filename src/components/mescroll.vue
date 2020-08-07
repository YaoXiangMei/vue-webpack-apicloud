<template>
  <div :id="mescrollId" ref="mescroll" class="mescroll dg-h-pct-100">
    <div>
      <slot />
      <section v-if="errMsg" @click="handlerReset" class="dg-p-24 dg-t-a-c">
        {{ errMsg }}
        <p class="dg-f-s-12 dg-m-t-b-12">
          点击刷新
        </p>
        <img class="dg-block dg-m-r-l-auto dg-w-h-32" src="@/assets/images/refresh/icon_refresh@3x.png">
      </section>
    </div>
  </div>
</template>

<script>
/**
 * @see {@link=http://www.mescroll.com/}
*/
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'

export default {
  name: 'Mescroll',
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
    mescrollId: {// mescroll id
      type: [String],
      default () {
        return `mescroll-id-${+new Date()}`
      }
    },
    mescrollOptions: {// 插件的配置
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data () {
    return {
      mescroll: null, // mescroll实例对象
      defaultRq: {// 默认的请求参数
        page: 0,
        limit: 15
      },
      list: [],
      type: 'more', // 是刷新还是加载更多
      errMsg: '', // 错误的信息
      currentScrollTop: 0, // 当前滚动条的位置
      isExternalResetScrollTop: false, // 如果外部需要自己来设置scrollTop的话，那么组件内部将不会再去设置
      mescrollDefaultOptions: null
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
  mounted () {
    // 创建MeScroll对象
    if (this.rq.limit) {
      this.defaultRq.limit = this.rq.limit
    }
    this.mescrollDefaultOptions = { // 在mounted初始化mescroll,确保此处配置的ref有值
      down: {// 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则down可不用写了)
        callback: this.downCallback,
        auto: false
      },
      up: {
        callback: this.upCallback,
        // 以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: this.defaultRq.limit // 每页数据条数,默认15
        },
        htmlNodata: '<p class="upwarp-nodata">没有更多数据了~~</p>',
        noMoreSize: 0, // 如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据; 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        toTop: {
          // 回到顶部按钮
          src: '', // 图片路径,默认null,支持网络图
          offset: 1000 // 列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: this.mescrollId, // 父布局的id (1.3.5版本支持传入dom元素)
          icon: '', // 图标,默认null,支持网络图
          tip: '暂无相关数据~' // 提示
        },
        onScroll: (mescroll, y, isUp) => {
          this.$emit('scroll', mescroll, y, isUp)
        }
      }
    }
    this.mescrollDefaultOptions = this.$tools.merge(this.mescrollDefaultOptions, this.mescrollOptions)
    this.mescroll = new MeScroll(this.$refs.mescroll, this.mescrollDefaultOptions)
    this.$emit('mescroll', this.mescroll)
  },
  methods: {
    downCallback () {
      this.mescroll.lockUpScroll(false)// 解锁上拉加载
      this.errMsg = ''// 关闭错误提示
      this.list = []
      this.$emit('refresh')
      this.defaultRq.page = 1
      this.getList({ type: 'refresh' })
    },
    upCallback () {
      this.type = 'more'
      this.defaultRq.page++
      this.getList()
    },
    async getList ({ type = 'more' } = {}) { // type=more是加载更多，type=refresh是刷新
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
        this.mescroll.endSuccess(data.length)
        this.mescroll.lockUpScroll(false)
      } catch ({ msg, message }) {
        this.mescroll.endErr()
        this.errMsg = msg || message
        api.toast({ msg: msg || message || '获取数据失败', location: 'middle' })
        this.mescroll.lockUpScroll(false)// 锁定上拉加载
      }
    },
    handlerReset () {
      // 保险一点 重置所有的数据
      this.mescroll.triggerDownScroll()
    },
    resetScrollTop (top = 0, time = 0) { // 提供一个方法给组件外部调用 可以重置scrollTop
      this.mescroll.scrollTo(top, time)
      this.isExternalResetScrollTop = true
      setTimeout(() => {
        this.isExternalResetScrollTop = false
      }, 0)
    }
  }
}
</script>
