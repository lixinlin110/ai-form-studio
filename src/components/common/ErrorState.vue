<script setup lang="ts">
import { WarningFilled } from '@element-plus/icons-vue'

defineProps<{
  message: string
  retryText?: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="error-state">
    <el-icon class="state-icon error"><WarningFilled /></el-icon>
    <h3>操作失败</h3>
    <p>{{ message }}</p>
    <el-button v-if="retryText" type="primary" plain @click="emit('retry')">{{ retryText }}</el-button>
  </div>
</template>
