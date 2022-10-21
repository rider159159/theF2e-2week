import { createRouter, createWebHistory } from "vue-router"
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { getToken, setToken } from './utils/js-cookie'
import { cancelAllPending } from './utils/CancelToken'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(),
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

  // to.matched.forEach((item) => {
  //   if (needTokenList.includes(item.path)) {
  //     if (!token) {
  //       router.push('/')
  //       useStore.changeLoading(false)
  //     }
  //   }
  // })

  // 判斷特定頁面給予不同 transition 效果
  // needFadeList.includes(to.path) ? to.meta.transitionName = 'scale' : to.meta.transitionName = 'slide'
})

export default router