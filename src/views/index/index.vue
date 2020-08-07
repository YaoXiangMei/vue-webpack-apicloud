<template>
  <main class="dg-f-s-16 dg-m-r-l-16">
    <button @click="handlerOpenTopic" class="dg-block dg-p-t-b-8 dg-w-pct-100 dg-m-t-16">
      打开window, Window+Frame滚动
    </button>
    <button @click="handlerOpenTopicGood" class="dg-block dg-p-t-b-8 dg-w-pct-100 dg-m-t-16">
      打开window, div滚动
    </button>
    <button @click="handlerOpenTopicGood" class="dg-block dg-p-t-b-8 dg-w-pct-100 dg-m-t-16">
      tools.js几个工具函数
    </button>
    <button @click="handlerChangeVuexState" class="dg-block dg-p-t-b-8 dg-w-pct-100 dg-m-t-16">
      点击修改vuex数据，请在“我的”页面查看更新后的数据
    </button>
    <dl class="dg-flex dg-a-i-c dg-j-c-s-b dg-p-t-b-16 dg-bd-b-ddd">
      <dt>
        年龄
      </dt>
      <dd>
        {{ user.profile.age }}
      </dd>
    </dl>
    <dl class="dg-flex dg-a-i-c dg-j-c-s-b dg-p-t-b-16">
      <dt>
        创建时间
      </dt>
      <dd>
        {{ user.createdAt }}
      </dd>
    </dl>
  </main>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import {
  USER_UPDATE
} from '@/store/mutation-types'
export default {
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapMutations('user', [
      USER_UPDATE
    ]),
    handlerChangeVuexState () {
      this[USER_UPDATE]({ profile: { age: this.user.profile.age + 1 }, createdAt: Date.now() })
    },
    handlerOpenTopic () {
      this.$tools.openWin({
        name: 'topic_index',
        url: 'topic_index.html'
      })
    },
    handlerOpenTopicGood () {
      this.$tools.openWin({
        name: 'topic_good',
        url: 'topic_good.html'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
