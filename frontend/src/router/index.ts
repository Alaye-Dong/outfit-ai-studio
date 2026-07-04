import { createRouter, createWebHistory } from 'vue-router'
import OutfitPreview from '@/views/OutfitPreview/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/outfit-preview'
    },
    {
      path: '/outfit-preview',
      name: 'OutfitPreview',
      component: OutfitPreview
    }
  ]
})

export default router
