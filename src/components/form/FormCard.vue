<script setup lang="ts">
import { Edit, View, Delete } from '@element-plus/icons-vue'
import type { FormRecord } from '../../types'

defineProps<{
  record: FormRecord
}>()

const emit = defineEmits<{
  view: [id: string]
  edit: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <article class="form-card">
    <div>
      <h3>{{ record.schema.title }}</h3>
      <p>{{ record.schema.description }}</p>
      <div class="card-meta">
        <el-tag>{{ record.schema.fields.length }} 个字段</el-tag>
        <span>{{ new Date(record.updatedAt).toLocaleString('zh-CN') }}</span>
      </div>
    </div>
    <div class="card-actions">
      <el-button :icon="View" plain @click="emit('view', record.id)">预览</el-button>
      <el-button :icon="Edit" type="primary" plain @click="emit('edit', record.id)">编辑</el-button>
      <el-button :icon="Delete" type="danger" plain @click="emit('delete', record.id)">删除</el-button>
    </div>
  </article>
</template>
