<template>
  <Nav @render="emitRender" title="CNode:Node.js专业中文社区" />
</template>
<script>
export default {
  methods: {
    emitRender (headerOffset) {
      this.$tools.openFrame({
        name: 'topic_index_frame',
        url: 'topic_index_frame.html',
        rect: {
          x: 0,
          y: headerOffset.h,
          w: 'auto',
          h: api.winHeight - headerOffset.h
        },
        pageParam: api.pageParam
      })
    }
  }
}
</script>
