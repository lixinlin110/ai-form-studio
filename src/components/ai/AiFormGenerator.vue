<script setup lang="ts">
import { MagicStick } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAiMode } from '../../api/ai'
import { useFormStore } from '../../stores/form'

const router = useRouter()
const formStore = useFormStore()

const prompt = ref('帮我生成一个实习报名表')
const aiMode = computed(() => getAiMode())

const examples = ['帮我生成一个实习报名表', '帮我生成一个用户反馈表', '帮我生成一个活动报名表', '帮我生成一个课程信息收集表']

const generate = async () => {
  const value = prompt.value.trim()
  if (!value) {
    ElMessage.warning('请先输入表单需求')
    return
  }

  const response = await formStore.generateByAi({ prompt: value })
  ElMessage.success(response.message)
}
</script>

<template>
  <section class="ai-generator panel">
    <div class="panel-header">
      <div>
        <p class="eyebrow">AI Generator</p>
        <h2>自然语言生成表单</h2>
      </div>
      <el-tag type="warning">当前模式：{{ aiMode === 'mock' ? 'Mock AI' : 'Remote AI' }}</el-tag>
    </div>

    <el-input
      v-model="prompt"
      type="textarea"
      :rows="5"
      resize="none"
      placeholder="例如：帮我生成一个实习报名表"
    />

    <div class="example-list">
      <el-tag v-for="item in examples" :key="item" effect="plain" @click="prompt = item">{{ item }}</el-tag>
    </div>

    <div class="next-actions">
      <el-button type="primary" size="large" :icon="MagicStick" :loading="formStore.aiStatus === 'loading'" @click="generate">
        生成表单 Schema
      </el-button>
      <el-button plain size="large" @click="router.push('/designer')">去设计器编辑</el-button>
      <el-button plain size="large" @click="router.push('/preview')">预览当前表单</el-button>
    </div>
  </section>
</template>
