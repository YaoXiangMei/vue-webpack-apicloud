<template>
  <div class="dg-flex dg-flex-d-c dg-h-vh-100">
    <Nav title="详情" />
    <div id="topic-detail-content-2020-8-12" v-html="data.content" class="dg-flex-1 dg-of-y-a" />
  </div>
</template>
<script>
import { topic } from '@/api/api'
export default {
  data () {
    return {
      data: {}
    }
  },
  created () {
    this.topic()
  },
  methods: {
    async topic () {
      api.showProgress({ title: '加载中' })
      try {
        const { data } = await topic(api.pageParam.id)
        this.data = data
      } catch ({ error_msg: msg, message }) {
        api.toast({ msg: msg || message, location: 'middle' })
      } finally {
        api.hideProgress()
      }
    }
  }
}
</script>
<style lang="scss">
#topic-detail-content-2020-8-12{
  width: 100%;
  min-width: 0;
  font-size: 16px;
  padding: 16px;
  *{
    max-width: 100%!important;
    word-break: break-all;
    white-space: pre-wrap;
  }
}
</style>
