import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/pages/Main.vue'
import { supabase } from '@/supabase.js'

let user = null

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      meta: { requiresAuth: true },
    },
    {
      path: '/auth',
      name:  'auth',
      component: () => import('@/pages/Auth.vue')
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/pages/ResetPassword.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession()
  const session = data.session

  if (to.path !== '/auth' && !session) {
    return next('/auth')
  }

  if (to.meta.requiresAuth && !session) {
    return next('/auth')
  }

  if (!to.meta.requiresAuth && session) {
    return next('/')
  }

  next()
})

export default router
