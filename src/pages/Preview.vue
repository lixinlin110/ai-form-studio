<script setup lang="ts">
import { ref } from 'vue'
import DynamicFormRenderer from '../components/form/DynamicFormRenderer.vue'
import { useFormStore } from '../stores/form'
import type { FormValues } from '../types'

const formStore = useFormStore()
const submitResult = ref<FormValues | null>(null)

const handleSubmit = (values: FormValues) => {
  submitResult.value = values
}
</script>

<template>
  <main class="page">
    <section class="page-heading">
      <p class="eyebrow">Preview</p>
      <h1>表单预览</h1>
      <p>根据当前 FormSchema 动态渲染真实表单，支持输入、必填校验、链接校验和提交结果展示。</p>
    </section>

    <section class="panel">
      <DynamicFormRenderer :schema="formStore.currentSchema" @submit="handleSubmit" />
    </section>

    <section v-if="submitResult" class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Submit Result</p>
          <h2>提交结果</h2>
        </div>
      </div>
      <pre class="schema-code">{{ JSON.stringify(submitResult, null, 2) }}</pre>
    </section>
  </main>
</template>
