export default {
  namespaced: true,
  state: {
    isShowThumb: true,
    thumbWidth: 0,
    pdfUrl:
      'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
    // '/static/進階套組報告20220106_1405.pdf'
  },
  getters: {
    isShowThumb: (state: any) => state.isShowThumb,
    thumbWidth: (state: any) => state.thumbWidth,
    pdfUrl: (state: any) => state.pdfUrl
  },
  mutations: {
    setThumb(state: any, data: boolean) {
      state.isShowThumb = data
    },
    setThumbWidth(state: any, data: number) {
      state.thumbWidth = data
    }
  },
  actions: {}
}
