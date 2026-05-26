<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import EmptyState from '../components/common/EmptyState.vue'
import FormCard from '../components/form/FormCard.vue'
import { useFormStore } from '../stores/form'

const router = useRouter()
const formStore = useFormStore()

const viewRecord = (id: string) => {
  formStore.loadRecord(id)
  router.push('/preview')
}

const editRecord = (id: string) => {
  formStore.loadRecord(id)
  router.push('/designer')
}

const deleteRecord = async (id: string) => {
  await ElMessageBox.confirm('确认删除这份表单吗？', '删除表单', { type: 'warning' })
  formStore.deleteRecord(id)
  ElMessage.success('表单已删除')
}
</script>

<template>
  <main class="page">
    <section class="page-heading">
      <p class="eyebrow">Forms</p>
      <h1>表单列表</h1>
      <p>展示保存到 localStorage 的历史表单，支持查看、继续编辑和删除。</p>
    </section>

    <EmptyState
      v-if="formStore.records.length === 0"
      title="还没有保存的表单"
      description="在设计器中点击保存后，表单会出现在这里。"
      action-text="去设计器"
      @action="router.push('/designer')"
    />

    <div v-else class="form-card-list">
      <FormCard
        v-for="record in formStore.records"
        :key="record.id"
        :record="record"
        @view="viewRecord"
        @edit="editRecord"
        @delete="deleteRecord"
      />
    </div>
  </main>
</template>
