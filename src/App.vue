<script setup lang="ts">
import { DataBoard, Files, House, MagicStick, Monitor, SetUp } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { path: '/home', label: '首页', icon: House },
  { path: '/designer', label: '设计器', icon: SetUp },
  { path: '/preview', label: '预览', icon: Monitor },
  { path: '/forms', label: '表单列表', icon: Files },
  { path: '/ai-generate', label: 'AI 生成', icon: MagicStick },
  { path: '/schema', label: 'JSON 管理', icon: DataBoard },
]
</script>

<template>
  <el-container class="app-shell">
    <el-aside width="240px" class="app-sidebar">
      <div class="brand">
        <strong>AI Form Studio</strong>
        <span>Low-Code Form Builder</span>
      </div>
      <el-menu :default-active="route.path" router>
        <el-menu-item v-for="item in navItems" :key="item.path" :index="item.path" @click="router.push(item.path)">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="app-header">
        <div>
          <strong>智能低代码表单搭建平台</strong>
          <span>Mock AI · Schema Driven · Vue3 + TypeScript</span>
        </div>
        <el-tag type="warning">VITE_AI_MODE=mock</el-tag>
      </el-header>
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
