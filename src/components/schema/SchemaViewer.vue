<script setup lang="ts">
import { Download, DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormSchema } from '../../types'
import { stringifySchema } from '../../utils/schema'

const props = defineProps<{
  schema: FormSchema
}>()

const copyJson = async () => {
  await navigator.clipboard.writeText(stringifySchema(props.schema))
  ElMessage.success('JSON Schema 已复制')
}

const downloadJson = () => {
  const blob = new Blob([stringifySchema(props.schema)], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${props.schema.title || 'form-schema'}.json`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <section class="schema-viewer">
    <div class="viewer-actions">
      <el-button :icon="DocumentCopy" plain @click="copyJson">复制 JSON</el-button>
      <el-button :icon="Download" type="primary" plain @click="downloadJson">导出文件</el-button>
    </div>
    <pre class="schema-code">{{ stringifySchema(schema) }}</pre>
  </section>
</template>
