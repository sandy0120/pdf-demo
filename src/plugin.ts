import mitt from 'mitt'
import _ from 'lodash'
import ElementPlus from 'element-plus'

import '@/styles/index.scss'
import '@/plugins/permission'

const install = (Vue: any) => {
  Vue.config.globalProperties.$baseUrl = import.meta.env.VITE_APP_BASE_API
  Vue.config.globalProperties.$bus = mitt()
  Vue.config.globalProperties.$_ = _
  Vue.use(ElementPlus)
  Vue.config.productionTip = false
}

export default {
  install
}
