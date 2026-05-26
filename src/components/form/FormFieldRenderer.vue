<script setup lang="ts">
import { computed } from 'vue'
import type { FieldSchema, FormValue } from '../../types'

const props = defineProps<{
  field: FieldSchema
  modelValue: FormValue
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FormValue]
}>()

const textValue = computed({
  get: () => (typeof props.modelValue === 'string' ? props.modelValue : ''),
  set: (value: string) => emit('update:modelValue', value),
})

const numberValue = computed({
  get: () => (typeof props.modelValue === 'number' ? props.modelValue : undefined),
  set: (value: number | undefined) => emit('update:modelValue', value ?? null),
})

const booleanValue = computed({
  get: () => Boolean(props.modelValue),
  set: (value: boolean) => emit('update:modelValue', value),
})

const listValue = computed({
  get: () => (Array.isArray(props.modelValue) ? props.modelValue : []),
  set: (value: Array<string | number | boolean>) => emit('update:modelValue', value),
})

const singleValue = computed({
  get: () => {
    if (Array.isArray(props.modelValue)) return ''
    return props.modelValue ?? ''
  },
  set: (value: string | number | boolean) => emit('update:modelValue', value),
})
</script>

<template>
  <el-form-item :label="field.label" :required="field.required" :error="error">
    <el-input
      v-if="field.type === 'input'"
      v-model="textValue"
      :placeholder="field.placeholder"
      clearable
    />

    <el-input-number
      v-else-if="field.type === 'number'"
      v-model="numberValue"
      :min="field.min"
      :max="field.max"
      controls-position="right"
      class="full-control"
    />

    <el-input
      v-else-if="field.type === 'textarea'"
      v-model="textValue"
      type="textarea"
      :rows="4"
      resize="none"
      :placeholder="field.placeholder"
    />

    <el-radio-group v-else-if="field.type === 'radio'" v-model="singleValue">
      <el-radio v-for="option in field.options || []" :key="String(option.value)" :label="option.value">
        {{ option.label }}
      </el-radio>
    </el-radio-group>

    <el-checkbox-group v-else-if="field.type === 'checkbox'" v-model="listValue">
      <el-checkbox v-for="option in field.options || []" :key="String(option.value)" :label="option.value">
        {{ option.label }}
      </el-checkbox>
    </el-checkbox-group>

    <el-select
      v-else-if="field.type === 'select'"
      v-model="singleValue"
      :placeholder="field.placeholder"
      clearable
      class="full-control"
    >
      <el-option v-for="option in field.options || []" :key="String(option.value)" :label="option.label" :value="option.value" />
    </el-select>

    <el-date-picker
      v-else-if="field.type === 'date'"
      v-model="textValue"
      type="date"
      value-format="YYYY-MM-DD"
      :placeholder="field.placeholder"
      class="full-control"
    />

    <el-rate v-else-if="field.type === 'rate'" v-model="numberValue" :max="field.max || 5" />

    <el-switch v-else-if="field.type === 'switch'" v-model="booleanValue" />

    <el-input
      v-else-if="field.type === 'link'"
      v-model="textValue"
      :placeholder="field.placeholder || '请输入 http 或 https 链接'"
      clearable
    />

    <p v-if="field.helpText" class="field-help">{{ field.helpText }}</p>
  </el-form-item>
</template>
