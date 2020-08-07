<template>
  <main class="dg-m-r-l-16">
    <button @click="handlerResetVuexState" class="dg-block dg-p-t-b-8 dg-w-pct-100 dg-m-t-16">
      点击重置vuex数据，请在“首页”页面查看更新后的数据
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
  USER_STORE
} from '@/store/mutation-types'
export default {
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapMutations('user', [
      USER_STORE
    ]),
    handlerResetVuexState () {
      this[USER_STORE]({ profile: { age: 1 }, createdAt: '' })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
