<template>
  <div
    class="pdf-block"
    :style="{ 'margin-left': isShow ? thumbWidth + 'px' : 0 }"
  >
    <div class="tool-block">
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="8"></el-col>
        <el-col :span="8">
          <el-row type="flex" align="middle" justify="center">
            <el-icon class="tool-icon" @click="changePage(page - 1)">
              <CaretLeft />
            </el-icon>
            {{ page }} /
            {{ pdfPages }}
            <el-icon class="tool-icon" @click="changePage(page + 1)">
              <CaretRight />
            </el-icon>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" align="middle" justify="end">
            <el-icon
              class="tool-icon"
              :class="{ disabled: pdfScale + 0.1 > 3 }"
              @click="zoom('+')"
            >
              <ZoomIn />
            </el-icon>
            <el-icon
              class="tool-icon"
              :class="{ disabled: pdfScale - 0.1 < 1 }"
              @click="zoom('-')"
            >
              <ZoomOut />
            </el-icon>
            <el-icon class="tool-icon" @click="downloadPDF">
              <Download />
            </el-icon>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div>
      <canvas :id="'pdfCanvas' + page" v-bind="canvasAttrs"></canvas>
    </div>
  </div>
  <ScrollUp />
</template>

<script lang="ts">
import { useStore, mapGetters } from 'vuex'
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import {
  CaretLeft,
  CaretRight,
  ZoomOut,
  ZoomIn,
  Download
} from '@element-plus/icons-vue'
import * as PDFJS from 'pdfjs-dist'
PDFJS.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js'

export default {
  components: {
    CaretLeft,
    CaretRight,
    ZoomOut,
    ZoomIn,
    Download
  },
  props: {
    page: {
      type: Number,
      default: 1
    }
  },
  emits: ['page'],
  computed: {
    ...mapGetters({
      isShow: 'report/isShowThumb',
      thumbWidth: 'report/thumbWidth'
    })
  },
  setup(props: any, { emit }: any) {
    //init
    const store = useStore()

    //state
    const pdfPages = ref<number>(0) // 總頁數
    const pdfDoc: any = ref('') // Pdf內容
    const pdfScale = ref<number>(1.5) // 放大倍數
    const viewport: any = ref({})
    const pdfUrl = computed(() => {
      return store.state.report.pdfUrl
    })

    const originalViewport: any = computed(() => {
      return Object.assign({ _scale: pdfScale.value }, viewport.value)
    })
    const canvasStyle = computed(() => {
      const {
        width: originalWidth,
        height: originalHeight,
        _scale: scale
      } = originalViewport.value
      const [pixelWidth, pixelHeight] = [
        originalWidth,
        originalHeight
      ].map(num => Math.ceil(num * (scale * 0.5)))
      return `width: ${pixelWidth}px; height: ${pixelHeight}px;`
    })
    const canvasAttrs = computed(() => {
      const { width, height } = viewport.value
      const res = [width, height].map(num => Math.ceil(num))
      const style = canvasStyle.value

      return {
        width: res[0],
        height: res[1],
        style,
        class: 'pdf-page'
      }
    })

    //function
    const renderPage = (num: number) => {
      pdfDoc.value.getPage(num).then(async (page: any) => {
        store.commit('app/setLoading', 1)
        const canvas: any = await document.getElementById('pdfCanvas' + num)
        if (canvas) {
          const ctx: any = canvas.getContext('2d')
          if (page._pageIndex === 0) {
            viewport.value = page.getViewport({ scale: pdfScale.value })
          }

          // 將 PDF render 到 canvas 上下文中
          const renderContext = {
            canvasContext: ctx,
            viewport: viewport.value
          }
          page.render(renderContext)

          store.commit('app/setLoading', 0)
        }
      })
    }

    const changePage = (num: number) => {
      if (num > 0 && num <= pdfPages.value) {
        emit('update:page', num)
      }
    }
    watch(
      () => props.page,
      () => renderPage(props.page)
    )

    const zoom = (action: string) => {
      if (action === '+') {
        if (pdfScale.value + 0.1 <= 3) pdfScale.value += 0.1
      } else {
        if (pdfScale.value - 0.1 >= 1) pdfScale.value -= 0.1
      }
    }
    const downloadPDF = async () => {
      window.location.href = pdfUrl.value
    }
    const loadFile = (url: string) => {
      const loadingTask = PDFJS.getDocument(url)
      loadingTask.promise.then((pdf: any) => {
        pdfDoc.value = pdf
        pdfPages.value = pdf.numPages
        nextTick(() => {
          renderPage(1)
        })
      })
    }

    onMounted(() => {
      store.commit('app/setLoading', 1)
      loadFile(pdfUrl.value)
    })

    return {
      pdfPages,
      pdfUrl,
      pdfDoc,
      pdfScale,
      viewport,
      originalViewport,
      canvasStyle,
      canvasAttrs,
      changePage,
      zoom,
      downloadPDF
    }
  }
}
</script>
<style lang="scss">
.pdf-block {
  margin: 0 auto 20px;
  width: 100%;
  user-select: none;
  .pdf-page {
    box-shadow: 0px 2px 9px 1px $grey-2;
  }
}

.tool-block {
  position: sticky;
  top: 0;
  padding: 20px 0 12px;
  margin-bottom: 32px;
  width: 100%;
  background-color: $white;
  .tool-icon {
    margin: 0 16px;
    font-size: 24px;
    cursor: pointer;
    &:hover {
      color: $primary;
    }
  }
}
</style>
