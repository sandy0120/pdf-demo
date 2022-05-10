<template>
  <transition name="fade">
    <div v-if="isShowBack" class="up" @click="backTop">
      <arrow-up-bold />
    </div>
  </transition>
</template>

<script lang="ts">
import { ArrowUpBold } from '@element-plus/icons-vue'
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ScrollUp',
  components: {
    ArrowUpBold
  },
  setup() {
    const isShowBack = ref(false)

    const backTop = () => {
      let distance = window.scrollY
      const step = distance / 30
      const jump = () => {
        if (distance > 0) {
          distance -= step
          window.scrollTo(0, distance)
        } else {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          clearInterval(scrollID)
        }
      }
      const scrollID = setInterval(jump, 10)
    }
    const onScroll = () => {
      const position = window.scrollY
      if (position < 56) {
        isShowBack.value = false
      } else {
        isShowBack.value = true
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', onScroll)
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
    })

    return {
      backTop,
      isShowBack
    }
  }
}
</script>

<style scoped lang="scss">
.up {
  position: fixed;
  bottom: 50px;
  right: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: $primary;
  border-radius: 50%;
  cursor: pointer;
  .icon {
    color: $white;
    width: 30px;
    height: 30px;
  }
}
</style>
