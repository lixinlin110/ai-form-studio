<script setup lang="ts">
import AiFormGenerator from '../components/ai/AiFormGenerator.vue'
import SchemaViewer from '../components/schema/SchemaViewer.vue'
import { useFormStore } from '../stores/form'

const formStore = useFormStore()
</script>

<template>
  <main class="page">
    <section class="page-heading">
      <p class="eyebrow">Mock AI</p>
      <h1>AI 生成表单</h1>
      <p>输入自然语言需求，由 mock 规则生成表单 Schema。没有 .env 和 API Key 时也能完整演示。</p>
    </section>

    <AiFormGenerator />

    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Generated Schema</p>
          <h2>当前表单 Schema</h2>
        </div>
      </div>
      <SchemaViewer :schema="formStore.currentSchema" />
    </section>
  </main>
</template>
