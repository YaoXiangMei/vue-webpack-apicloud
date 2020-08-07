<template>
  <div ref="header">
    <nav class="dg-w-h-44 dg-w-pct-100 dg-pos-r dg-flex dg-a-i-c dg-bd-b-efefef">
      <slot name="left">
        <span v-if="isShowBack" @click="handlerBack" class="dg-pos-a dg-pos-t-0 dg-pos-l-0 dg-h-pct-100 dg-p-l-12 dg-flex dg-a-i-c">
          <span class="dg-f-s-18 dg-m-l-16">
            返回
          </span>
        </span>
      </slot>
      <h3 v-text="title" class="dg-flex-1 dg-f-s-18 dg-f-w-bold dg-t-a-c dg-p-r-l-32 dg-e-1" />
      <slot name="right" />
    </nav>
    <slot name="bottom" />
  </div>
</template>

<script>
export default {
  props: {
    title: {// 标题
      type: [String],
      required: true,
      default: () => {
        return ''
      }
    },
    isShowBack: {// 是否显示返回按钮
      type: [Boolean],
      required: false,
      default: () => {
        return true
      }
    },
    isAutoCloseWin: {// 是否自动关闭win
      type: [Boolean],
      required: false,
      default: () => {
        return true
      }
    }
  },
  mounted () {
    const header = this.$refs.header
    $api.fixStatusBar(header)
    this.$nextTick(() => {
      let headerOffset = $api.offset(header)
      this.$emit('render', headerOffset)
    })
  },
  methods: {
    handlerBack () {
      this.isAutoCloseWin && api.closeWin()
      this.$emit('back')
    }
  }
}
</script>
