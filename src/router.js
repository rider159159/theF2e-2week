import { createRouter, createWebHashHistory  } from "vue-router"
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHashHistory ('/step1'),
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

export default router