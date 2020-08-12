<template>
  <div>
    <NativeScroll @change="data => list = data.data" :api="api" :rq="rq">
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
    </NativeScroll>
  </div>
</template>

<script>
import NativeScroll from '@/components/native_scroll'
import { topics } from '@/api/api'
export default {
  components: {
    NativeScroll
  },
  data () {
    return {
      api: topics,
      list: [],
      rq: {
        limit: 15
      }
    }
  },
  methods: {
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

<style lang="scss" scoped>

</style>
