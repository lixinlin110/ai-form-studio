<script setup lang="ts">
import { computed } from 'vue'
import type { FieldOption, FieldSchema } from '../../types'
import { useFormStore } from '../../stores/form'
import EmptyState from '../common/EmptyState.vue'

const formStore = useFormStore()
const selectedField = computed(() => formStore.selectedField)

const updateFormTitle = (title: string) => formStore.updateFormMeta({ title })
const updateFormDescription = (description: string) => formStore.updateFormMeta({ description })
const updateField = (patch: Partial<FieldSchema>) => formStore.updateSelectedField(patch)

const updateOption = (index: number, patch: Partial<FieldOption>) => {
  if (!selectedField.value) return
  const options = [...(selectedField.value.options || [])]
  options[index] = { ...options[index], ...patch }
  updateField({ options })
}

const addOption = () => {
  if (!selectedField.value) return
  const options = [...(selectedField.value.options || [])]
  options.push({ label: `选项${options.length + 1}`, value: `option_${options.length + 1}` })
  updateField({ options })
}

const removeOption = (index: number) => {
  if (!selectedField.value) return
  const options = [...(selectedField.value.options || [])]
  options.splice(index, 1)
  updateField({ options })
}
</script>

<template>
  <aside class="designer-panel property-panel">
    <div class="panel-title">
      <p class="eyebrow">Properties</p>
      <h2>属性配置</h2>
    </div>

    <el-form label-position="top">
      <el-form-item label="表单标题">
        <el-input :model-value="formStore.currentSchema.title" @update:model-value="updateFormTitle" />
      </el-form-item>
      <el-form-item label="表单说明">
        <el-input
          :model-value="formStore.currentSchema.description"
          type="textarea"
          :rows="3"
          resize="none"
          @update:model-value="updateFormDescription"
        />
      </el-form-item>
    </el-form>

    <el-divider />

    <EmptyState
      v-if="!selectedField"
      title="未选中字段"
      description="点击画布中的字段后，可以在这里配置属性。"
    />

    <el-form v-else label-position="top">
      <el-form-item label="字段标题 label">
        <el-input :model-value="selectedField.label" @update:model-value="updateField({ label: $event })" />
      </el-form-item>
      <el-form-item label="字段名 field">
        <el-input :model-value="selectedField.field" @update:model-value="updateField({ field: $event })" />
      </el-form-item>
      <el-form-item label="占位提示 placeholder">
        <el-input :model-value="selectedField.placeholder" @update:model-value="updateField({ placeholder: $event })" />
      </el-form-item>
      <el-form-item label="帮助文本 helpText">
        <el-input :model-value="selectedField.helpText" @update:model-value="updateField({ helpText: $event })" />
      </el-form-item>
      <el-form-item label="宽度">
        <el-radio-group :model-value="selectedField.width" @update:model-value="updateField({ width: $event })">
          <el-radio-button label="100%">整行</el-radio-button>
          <el-radio-button label="50%">半行</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否必填">
        <el-switch :model-value="selectedField.required" @update:model-value="updateField({ required: $event })" />
      </el-form-item>
      <el-form-item v-if="selectedField.type === 'number' || selectedField.type === 'rate'" label="最小值 / 最大值">
        <div class="inline-inputs">
          <el-input-number :model-value="selectedField.min" @update:model-value="updateField({ min: $event ?? undefined })" />
          <el-input-number :model-value="selectedField.max" @update:model-value="updateField({ max: $event ?? undefined })" />
        </div>
      </el-form-item>

      <div v-if="selectedField.options" class="option-editor">
        <div class="option-header">
          <strong>选项配置</strong>
          <el-button size="small" plain @click="addOption">新增</el-button>
        </div>
        <div v-for="(option, index) in selectedField.options" :key="index" class="option-row">
          <el-input :model-value="option.label" placeholder="展示文本" @update:model-value="updateOption(index, { label: $event })" />
          <el-input :model-value="String(option.value)" placeholder="选项值" @update:model-value="updateOption(index, { value: $event })" />
          <el-button text type="danger" @click="removeOption(index)">删</el-button>
        </div>
      </div>
    </el-form>
  </aside>
</template>
