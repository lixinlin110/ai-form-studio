<script setup lang="ts">
import { Delete, DocumentChecked, View } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import ComponentPanel from '../components/designer/ComponentPanel.vue'
import DesignCanvas from '../components/designer/DesignCanvas.vue'
import PropertyPanel from '../components/designer/PropertyPanel.vue'
import { useFormStore } from '../stores/form'
import type { FieldType } from '../types'

const router = useRouter()
const formStore = useFormStore()

const addField = (type: FieldType) => {
  formStore.addField(type)
}

const saveForm = () => {
  formStore.saveCurrentForm()
  ElMessage.success('表单已保存到本地历史记录')
}

const clearCanvas = async () => {
  await ElMessageBox.confirm('确认清空当前画布中的所有字段吗？', '清空画布', { type: 'warning' })
  formStore.clearCanvas()
}
</script>

<template>
  <main class="designer-page">
    <div class="designer-toolbar">
      <div>
        <p class="eyebrow">Designer</p>
        <h1>表单设计器</h1>
      </div>
      <div class="toolbar-actions">
        <el-button :icon="DocumentChecked" type="primary" @click="saveForm">保存表单</el-button>
        <el-button :icon="View" plain @click="router.push('/preview')">实时预览</el-button>
        <el-button :icon="Delete" plain type="danger" @click="clearCanvas">清空画布</el-button>
      </div>
    </div>

    <section class="designer-layout">
      <ComponentPanel @add="addField" />
      <DesignCanvas />
      <PropertyPanel />
    </section>
  </main>
</template>
