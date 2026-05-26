<script setup lang="ts">
import { CopyDocument, Delete, Rank } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import { computed } from 'vue'
import type { FieldSchema, FieldType } from '../../types'
import { useFormStore } from '../../stores/form'
import EmptyState from '../common/EmptyState.vue'

const formStore = useFormStore()

const fields = computed({
  get: () => formStore.currentSchema.fields,
  set: (value: FieldSchema[]) => formStore.setFields(value),
})

const selectedFieldId = computed(() => formStore.selectedFieldId)

const handleDrop = (event: DragEvent) => {
  const type = event.dataTransfer?.getData('field-type') as FieldType
  if (!type) return
  formStore.addField(type)
}
</script>

<template>
  <section class="design-canvas" @dragover.prevent @drop.prevent="handleDrop">
    <div class="canvas-header">
      <div>
        <p class="eyebrow">Canvas</p>
        <h2>{{ formStore.currentSchema.title }}</h2>
        <p>{{ formStore.currentSchema.description }}</p>
      </div>
      <el-tag>{{ fields.length }} 个字段</el-tag>
    </div>

    <EmptyState
      v-if="fields.length === 0"
      title="画布为空"
      description="从左侧拖拽组件到这里，或点击组件快速添加。"
    />

    <draggable
      v-else
      v-model="fields"
      item-key="id"
      handle=".drag-handle"
      class="canvas-field-list"
      :animation="180"
    >
      <template #item="{ element }: { element: FieldSchema }">
        <article
          class="canvas-field"
          :class="{ selected: element.id === selectedFieldId }"
          @click="formStore.selectField(element.id)"
        >
          <div class="field-main">
            <button class="icon-button drag-handle" type="button" title="拖拽排序">
              <el-icon><Rank /></el-icon>
            </button>
            <div>
              <strong>{{ element.label }}</strong>
              <p>{{ element.field }} · {{ element.type }} · {{ element.required ? '必填' : '选填' }}</p>
            </div>
          </div>
          <div class="field-actions">
            <el-button :icon="CopyDocument" text @click.stop="formStore.duplicateField(element.id)">复制</el-button>
            <el-button :icon="Delete" text type="danger" @click.stop="formStore.deleteField(element.id)">删除</el-button>
          </div>
        </article>
      </template>
    </draggable>
  </section>
</template>
