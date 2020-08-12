<template>
  <div>
    <header id="header" class="dg-bg-c-1e844d" />
    <footer id="footer" class="footer dg-pos-f dg-pos-b-0 dg-pos-l-0 dg-w-h-50 dg-w-vw-100 dg-bg-c-fff">
      <ul class="dg-flex dg-t-a-c dg-h-pct-100">
        <li
          v-for="({title}, index) in tabs"
          :key="index"
          @click="handlerSwitchTab(index)"
          :class="{'active': index === activeIndex}"
          class="dg-flex-1 dg-flex dg-a-i-c dg-j-c-c">
          <p v-text="title" class="dg-f-s-18" />
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>

export default {
  data () {
    return {
      tabs: [{
        title: '首页',
        name: 'index_index'
      }, {
        title: '我的',
        name: 'user_index'
      }],
      activeIndex: 0
    }
  },
  async mounted () {
    this.$nextTick(() => { this.openFrameGroup() })

    this.$tools.closeApp()
  },
  methods: {
    handlerSwitchTab (index) {
      this.activeIndex = index
      api.setFrameGroupIndex({
        name: 'mainFrameGroup',
        index
      })
    },
    openWin (name) {
      this.$tools.openWin({ name, url: `${name}.html` })
    },
    openFrameGroup () {
      let headerH = $api.fixStatusBar($api.byId('header')),
        footer = $api.byId('footer'),
        footerOffset = $api.offset(footer)
      $api.fixTabBar(footer)
      let frames = [],
        y = headerH,
        h = api.winHeight - headerH - footerOffset.h
      this.tabs.forEach(({ name }, index) => {
        frames.push({
          name,
          url: `${name}.html`,
          pageParam: {
            y,
            h
          }
        })
      })
      this.$tools.openFrameGroup({
        name: 'mainFrameGroup',
        rect: {
          x: 0,
          y,
          w: 'auto',
          h
        },
        scrollEnabled: false,
        preload: 0,
        frames
      }, ({ index }, err) => {
        this.activeIndex = index
      })
    }
  }
}

</script>

<style lang="scss" scoped>
footer{
  .active{
    p{
      color: #1B7D48;
    }
  }
}
</style>
