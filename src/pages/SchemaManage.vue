<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import SchemaViewer from '../components/schema/SchemaViewer.vue'
import { useFormStore } from '../stores/form'
import { parseSchemaFromJson } from '../utils/schema'

const formStore = useFormStore()
const importText = ref('')

const importSchema = () => {
  const result = parseSchemaFromJson(importText.value)
  if (!result.valid || !result.schema) {
    ElMessage.error(result.message || 'Schema 导入失败')
    return
  }

  formStore.setCurrentSchema(result.schema)
  ElMessage.success('Schema 导入成功，已还原到当前表单')
}
</script>

<template>
  <main class="page">
    <section class="page-heading">
      <p class="eyebrow">JSON Schema</p>
      <h1>JSON 导入导出</h1>
      <p>查看当前表单 Schema，支持复制、导出 JSON 文件，也可以粘贴 JSON 导入并还原表单。</p>
    </section>

    <section class="schema-layout">
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Export</p>
            <h2>当前 Schema</h2>
          </div>
        </div>
        <SchemaViewer :schema="formStore.currentSchema" />
      </div>

      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Import</p>
            <h2>导入 JSON</h2>
          </div>
        </div>
        <el-input
          v-model="importText"
          type="textarea"
          :rows="18"
          resize="none"
          placeholder="请粘贴 FormSchema JSON"
        />
        <div class="next-actions">
          <el-button type="primary" @click="importSchema">导入并还原</el-button>
        </div>
      </div>
    </section>
  </main>
</template>
