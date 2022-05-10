//Layout
import MainLayout from '@/Layout/Main.vue'

//Pages
import PDFViewer from '@/views/PDFViewer.vue'
import NotFound from '@/views/NotFound.vue'

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'MainLayout',
    meta: { title: 'MainLayout' },
    component: MainLayout,
    children: [
      {
        name: 'PDF',
        path: '/',
        meta: { title: 'PDF', role: [0, 1, 2] },
        component: PDFViewer
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    meta: { title: '404', role: [0, 1, 2], hidden: true },
    component: NotFound
  },
  {
    path: '/:path(.*)',
    meta: { hidden: true },
    redirect: { name: '404' }
  }
]
const router = createRouter({
  history: createWebHistory('pdf-demo'),
  routes
})

export default router
