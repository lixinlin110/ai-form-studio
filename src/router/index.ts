import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', name: 'home', component: () => import('../pages/Home.vue') },
    { path: '/designer', name: 'designer', component: () => import('../pages/Designer.vue') },
    { path: '/preview', name: 'preview', component: () => import('../pages/Preview.vue') },
    { path: '/forms', name: 'forms', component: () => import('../pages/FormList.vue') },
    { path: '/ai-generate', name: 'ai-generate', component: () => import('../pages/AiGenerate.vue') },
    { path: '/schema', name: 'schema', component: () => import('../pages/SchemaManage.vue') },
  ],
})

export default router
