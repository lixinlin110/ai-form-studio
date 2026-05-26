<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="loading-state">
    <el-skeleton :rows="5" animated />
    <p>{{ text || '处理中，请稍候...' }}</p>
  </div>
</template>
