import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
const modulesFiles: any = import.meta.globEager('./modules/**.ts')
const modules: any = {}

for (const key in modulesFiles) {
  modules[key.replace(/(\.\/modules\/|\.ts)/g, '')] = modulesFiles[key].default
}
Object.keys(modules).forEach((item: any) => {
  modules[item]['namespaced'] = true
})

const store = createStore({
  modules,
  plugins: [
    createPersistedState({
      paths: ['persistedState', 'app.lang']
    })
  ]
})

export default store
