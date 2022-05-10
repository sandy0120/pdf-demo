export default {
  namespaced: true,
  state: {
    loading: 0,
    lang: 'en'
  },
  getters: {
    loading: (state: any) => state.loading,
    lang: (state: any) => state.lang
  },
  mutations: {
    setLoading: (state: any, data: number) => {
      state.loading = data
    },
    setLang(state: any, value: any) {
      state.lang = value
    }
  },
  actions: {
    handleFormData({ commit }: any, data: any) {
      const fd = new FormData()
      Object.keys(data).forEach(x => {
        fd.append(x, data[x])
      })
      return fd
    }
  }
}
