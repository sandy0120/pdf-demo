import axios from 'axios'
import store from '@/store'
import router from '@/router'

const service = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_API}`,
  withCredentials: false,
  timeout: 20000
})

service.interceptors.request.use(
  config => {
    const storeGetters = store.getters
    //
    const loading: number = storeGetters['app/loading']
    store.commit('app/setLoading', loading + 1)
    //
    const token = storeGetters['persistedState/token']
    if (token) {
      config.headers['authorization'] = 'Bearer ' + token
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const storeGetters = store.getters
    const loading: number = storeGetters['app/loading']
    store.commit('app/setLoading', loading - 1)

    if (response.status === 200 && response.data) {
      const { data } = response
      if (data.code === 200001) {
        return data.result
      } else {
        return data.result
      }
    } else {
      return response
    }
  },
  error => {
    const storeGetters = store.getters
    const loading: number = storeGetters['app/loading']
    store.commit('app/setLoading', loading - 1)

    const response = error.response
    switch (response.status) {
      case 401:
        store.dispatch('persistedState/cleanPersistedState')
        router.push({ name: 'Login' })
        break
      case 403:
        break
      case 404:
        break
      case 422:
        break
      default:
        break
    }
    return response.data
  }
)

export default service
