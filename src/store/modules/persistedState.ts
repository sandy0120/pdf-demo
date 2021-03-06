const state = {
  isRememberChecked: false,
  loginData: {
    email: '',
    password: ''
  },
  token: '',
  personal: {}
}

const getters = {
  isRememberChecked: (state: any) => state.isRememberChecked,
  loginData: (state: any) => state.loginData,
  token: (state: any) => state.token,
  personal: (state: any) => state.personal
}

const mutations = {
  setRememberChecked(state: any, checked: boolean) {
    state.isRememberChecked = checked
  },
  setLoginData(state: any, data: any) {
    state.loginData = data
  },
  setToken(state: any, data: string) {
    state.token = data
  },
  setPersonal(state: any, data: any) {
    state.personal = data
  }
}

const actions = {
  async getToken({ commit }: any, data: string) {
    await commit('setToken', data)
  },
  async getPersonal({ commit }: any, data: any) {
    await commit('setPersonal', data)
  },
  async cleanPersistedState({ commit }: any) {
    await commit('setToken', '')
    await commit('setPersonal', {})
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
