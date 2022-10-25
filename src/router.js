import { createRouter, createWebHashHistory  } from "vue-router"
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { getToken, setToken } from './utils/js-cookie'
import { cancelAllPending } from './utils/CancelToken'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHashHistory (),
  routes,
  // https://router.vuejs.org/guide/advanced/scroll-behavior.html#delaying-the-scroll
  scrollBehavior(from, to, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (savedPosition) return resolve(savedPosition)
        return resolve({ left: 0, top: 0 })
      }, 1310)
    })
  }
})

router.beforeEach((to, from) => {
  if (to.path === from.path) return

  cancelAllPending()
})

export default router