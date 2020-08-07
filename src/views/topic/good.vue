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
      随便放点东西
    </footer>
  </div>
</template>
<script>
import Mescroll from '@/components/mescroll'
import { topics } from '@/api/api'

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
  methods: {
  }
}
</script>
