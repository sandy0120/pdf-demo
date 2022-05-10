<template>
  <el-row style="width:100%">
    <ThumbMenu v-model:page="page" />
    <PDFRender v-model:page="page" />
  </el-row>
  <ScrollUp />
</template>

<script lang="ts">
import { ref } from 'vue'
import ThumbMenu from '@/components/ThumbMenu.vue'
import PDFRender from '@/components/PDFRender.vue'

export default {
  components: {
    ThumbMenu,
    PDFRender
  },
  setup() {
    const page = ref<number>(1) // 頁數

    return {
      page
    }
  }
}
</script>
<style lang="scss"></style>
