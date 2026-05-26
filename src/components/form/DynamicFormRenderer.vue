<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'
import type { FormSchema, FormValues } from '../../types'
import { createFormValues } from '../../utils/schema'
import { validateFormValues } from '../../utils/validator'
import EmptyState from '../common/EmptyState.vue'
import FormFieldRenderer from './FormFieldRenderer.vue'

const props = defineProps<{
  schema: FormSchema
}>()

const emit = defineEmits<{
  submit: [values: FormValues]
}>()

const values = ref<FormValues>(createFormValues(props.schema))
const errors = ref<Record<string, string>>({})

watch(
  () => props.schema,
  (schema) => {
    values.value = createFormValues(schema)
    errors.value = {}
  },
  { deep: true },
)

const updateValue = (field: string, value: FormValues[string]) => {
  values.value = {
    ...values.value,
    [field]: value,
  }
  if (errors.value[field]) {
    errors.value = { ...errors.value, [field]: '' }
  }
}

const submit = () => {
  const result = validateFormValues(props.schema, values.value)
  errors.value = result.errors

  if (!result.valid) {
    ElMessage.warning('请先完成必填项和格式校验')
    return
  }

  emit('submit', { ...values.value })
}
</script>

<template>
  <section class="dynamic-form">
    <div class="form-title">
      <h2>{{ schema.title }}</h2>
      <p>{{ schema.description }}</p>
    </div>

    <EmptyState
      v-if="schema.fields.length === 0"
      title="当前表单没有字段"
      description="请先到设计器中拖拽组件，或通过 AI 生成表单。"
    />

    <el-form v-else label-position="top" @submit.prevent>
      <div class="preview-field-grid">
        <div v-for="field in schema.fields" :key="field.id" class="preview-field" :style="{ width: field.width }">
          <FormFieldRenderer
            :field="field"
            :model-value="values[field.field]"
            :error="errors[field.field]"
            @update:model-value="updateValue(field.field, $event)"
          />
        </div>
      </div>
      <el-button type="primary" size="large" @click="submit">提交表单</el-button>
    </el-form>
  </section>
</template>
