import router from '@/router'
import store from '@/store'
router.beforeEach((to, from, next) => {
  //document.title = to.meta.title
  const storeGetters = store.getters
  const hasToken = storeGetters['persistedState/token']

  const whiteList = ['/login', '/register']

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login`)
    }
  }
})
