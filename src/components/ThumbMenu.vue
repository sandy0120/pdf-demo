<template>
  <el-row
    type="flex"
    align="middle"
    class="menu-box"
    :style="`transform: translateX(-${isShow ? '0px' : thumbWidth + 'px'})`"
  >
    <div class="thumb-block" :style="`width: ${thumbWidth}px;`">
      <el-row
        type="flex"
        align="middle"
        justify="center"
        v-for="thumb in pdfPages"
        :key="thumb"
      >
        <div>{{ thumb }}</div>
        <canvas
          :id="'thumbCanvas' + thumb"
          class="thumb"
          :class="{ active: thumb === page }"
          @click="changePage(thumb)"
        ></canvas>
      </el-row>
    </div>
    <el-row
      type="flex"
      align="middle"
      justify="center"
      class="arrow"
      @click="$store.commit('report/setThumb', !isShow)"
    >
      <el-icon v-if="isShow">
        <ArrowLeftBold />
      </el-icon>
      <el-icon v-if="!isShow">
        <ArrowRightBold />
      </el-icon>
    </el-row>
  </el-row>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import * as PDFJS from 'pdfjs-dist'
PDFJS.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js'

export default {
  components: {
    ArrowLeftBold,
    ArrowRightBold
  },
  props: {
    page: {
      type: Number,
      default: 1
    }
  },
  emits: ['page'],
  setup(props: any, { emit }: any) {
    //init
    const store = useStore()

    //state
    const pdfPages = ref<number>(0) // 總頁數
    const thumbWidth = computed(() => {
      return store.state.report.thumbWidth
    }) // 縮圖寬度
    const thumbHeight = ref<number>(0) // 縮圖高度
    const thumbScale = ref<number>(0.2) // 縮圖放大倍數
    const pdfDoc: any = ref('') // Pdf內容
    const pdfUrl = computed(() => {
      return store.state.report.pdfUrl
    })
    const isShow = computed(() => {
      return store.state.report.isShowThumb
    })

    //function
    const renderThumb = (num: number) => {
      pdfDoc.value.getPage(num).then((page: any) => {
        store.commit('app/setLoading', 1)
        const canvas: any = document.getElementById('thumbCanvas' + num)
        if (canvas) {
          const ctx = canvas.getContext('2d')
          const dpr = window.devicePixelRatio || 1
          const bsr =
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio ||
            1
          const ratio = dpr / bsr
          const viewport = page.getViewport({ scale: thumbScale.value })
          canvas.width = viewport.width * ratio
          canvas.height = viewport.height * ratio
          canvas.style.width = viewport.width + 'px'
          store.commit('report/setThumbWidth', viewport.width + 150)

          canvas.style.height = viewport.height + 'px'
          thumbHeight.value = viewport.height + 8

          ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
          // 將 PDF render 到 canvas 上下文中
          const renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }
          page.render(renderContext)
          if (pdfPages.value > num) {
            renderThumb(num + 1)
          }
        }
        if (num > 5) {
          store.commit('app/setLoading', 0)
        }
      })
    }
    const loadFile = (url: string) => {
      const loadingTask = PDFJS.getDocument(url)
      loadingTask.promise.then((pdf: any) => {
        pdfDoc.value = pdf
        pdfPages.value = pdf.numPages
        nextTick(() => {
          renderThumb(1)
        })
      })
    }
    const changePage = (num: number) => {
      if (num > 0 && num <= pdfPages.value) {
        emit('update:page', num)
      }
    }
    const handlePosition = () => {
      const thumbBlock: any = document.querySelector('.thumb-block')
      const pageHight = thumbHeight.value + 16 + 16 //一頁高度
      const scrollTop = thumbBlock.scrollTop //滾輪位置
      const distance = props.page * pageHight //目標頁數距離
      const thumbBlockHeight = thumbBlock.offsetHeight //可見視窗高度

      if (
        distance - scrollTop > thumbBlockHeight ||
        distance - scrollTop < pageHight
      ) {
        thumbBlock.scrollTop = distance - pageHight
      }
    }

    watch(() => props.page, handlePosition)
    onMounted(() => {
      loadFile(pdfUrl.value)
    })

    return {
      isShow,
      pdfPages,
      thumbWidth,
      thumbHeight,
      thumbScale,
      pdfUrl,
      pdfDoc,
      changePage
    }
  }
}
</script>
<style scoped lang="scss">
.thumb-block {
  height: 100%;
  background-color: #f0f6f6;
  overflow: auto;
  user-select: none;
  .thumb {
    margin: 16px 0 16px 16px;
    border: 4px solid $white;
    cursor: pointer;
    &:hover {
      border: 4px solid $grey-1;
    }
    &.active {
      border: 4px solid $primary;
    }
  }
  //捲軸底色
  &::-webkit-scrollbar-track {
    background-color: $bg;
  }
  //捲軸寬度
  &::-webkit-scrollbar {
    width: 8px;
  }
  //捲軸本體顏色
  &::-webkit-scrollbar-thumb {
    background-color: $grey-1;
    border-radius: 20px;
  }
}
.arrow {
  padding: 8px 4px;
  background-color: $primary-2;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  .el-icon {
    color: $white;
    font-size: 24px;
  }
}
</style>
