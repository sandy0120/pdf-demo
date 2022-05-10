<template>
  <Loading />
  <div class="MainLayout">
    <el-row type="flex" justify="center" class="view">
      <transition name="fade" mode="out-in">
        <router-view :key="fullPath"></router-view>
      </transition>
    </el-row>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Loading from '@/components/Loading.vue'

export default {
  components: {
    Loading
  },
  setup() {
    const route = useRoute()
    const fullPath = computed(() => {
      return route.fullPath
    })

    return { fullPath }
  }
}
</script>
