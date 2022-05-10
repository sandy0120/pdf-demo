<template>
  <div
    v-if="loading"
    class="mask"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  />
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      loading: 'app/loading'
    })
  }
}
</script>
<style scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 999;
}
</style>
