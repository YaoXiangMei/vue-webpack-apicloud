<template>
  <div class="dg-flex dg-flex-d-c dg-h-vh-100">
    <Nav title="CNode:Node.js专业中文社区" />
    <header class="dg-f-s-14 dg-p-16 dg-t-a-c">
      随便放点东西
    </header>
    <div class="dg-flex-1 dg-of-y-a">
      <Mescroll @change="data => list = data.data" :api="api">
        <ul>
          <li
            v-for="item in list" :key="item.id"
            @click="handlerToDetail(item)"
            class="dg-flex dg-a-i-c dg-f-s-16 dg-p-16 dg-bd-b-efefef dg-bg-c-fff">
            <img :src="item.author.avatar_url" class="dg-w-h-24">
            <h3 class="dg-flex-1 dg-e-2 dg-m-l-16">
              {{ item.title }}
            </h3>
          </li>
        </ul>
      </Mescroll>
    </div>
    <footer class="dg-f-s-14 dg-p-16 dg-t-a-c">
      <button @click="handlerChangeVuexState" class="dg-block dg-p-t-b-8 dg-w-pct-100">
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
    </footer>
  </div>
</template>
<script>
import Mescroll from '@/components/mescroll'
import { topics } from '@/api/api'
import { mapState, mapMutations } from 'vuex'

import {
  USER_UPDATE
} from '@/store/mutation-types'
export default {
  components: {
    Mescroll
  },
  data () {
    return {
      api: topics,
      list: []
    }
  },
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
    handlerToDetail ({ id }) {
      this.$tools.openWin({
        name: 'topic_detail_index',
        url: 'topic_detail_index.html',
        pageParam: {
          id
        }
      })
    }
  }
}
</script>
