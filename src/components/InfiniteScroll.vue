<script lang="ts">
import { onMounted, onUnmounted, getCurrentInstance } from 'vue'

export default {
  name: 'InfiniteScroll',
  emits: ['action'],
  setup(props, { emit }) {
    const internalInstance: any = getCurrentInstance()
    const $_ = internalInstance.appContext.config.globalProperties.$_

    const onScroll = () => {
      const position = window.scrollY
      const visibleHeight = window.innerHeight
      const bodyHeight = document.body.offsetHeight
      if (position + visibleHeight > bodyHeight - 700) {
        emit('action')
      }
    }

    const throttle = $_.throttle(onScroll, 500)

    onMounted(() => {
      const scroll = document.getElementById('scroll') as HTMLElement
      scroll.addEventListener('scroll', throttle)
    })
    onUnmounted(() => {
      const scroll = document.getElementById('scroll') as HTMLElement
      scroll.removeEventListener('scroll', throttle)
    })

    return {}
  }
}
</script>

<style scoped lang="scss"></style>
