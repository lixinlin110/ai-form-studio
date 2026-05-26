<script setup lang="ts">
import { CirclePlus } from '@element-plus/icons-vue'
import { componentMetas } from '../../utils/schema'
import type { FieldType } from '../../types'

const emit = defineEmits<{
  add: [type: FieldType]
}>()

const handleDragStart = (event: DragEvent, type: FieldType) => {
  event.dataTransfer?.setData('field-type', type)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy'
}
</script>

<template>
  <aside class="designer-panel component-panel">
    <div class="panel-title">
      <p class="eyebrow">Components</p>
      <h2>组件面板</h2>
    </div>

    <div class="component-list">
      <button
        v-for="item in componentMetas"
        :key="item.type"
        class="component-item"
        draggable="true"
        @dragstart="handleDragStart($event, item.type)"
        @click="emit('add', item.type)"
      >
        <span>
          <strong>{{ item.label }}</strong>
          <small>{{ item.description }}</small>
        </span>
        <el-icon><CirclePlus /></el-icon>
      </button>
    </div>
  </aside>
</template>
