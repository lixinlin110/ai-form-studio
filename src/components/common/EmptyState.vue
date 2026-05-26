<script setup lang="ts">
import { Box } from '@element-plus/icons-vue'

defineProps<{
  title: string
  description?: string
  actionText?: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="empty-state">
    <el-icon class="state-icon"><Box /></el-icon>
    <h3>{{ title }}</h3>
    <p v-if="description">{{ description }}</p>
    <el-button v-if="actionText" type="primary" @click="emit('action')">{{ actionText }}</el-button>
  </div>
</template>
