<script setup lang="ts">
import { Collection, Connection, EditPen, MagicStick, Tickets } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  { icon: EditPen, title: '拖拽式设计器', desc: '左侧组件面板、中间设计画布、右侧属性配置，形成完整低代码编辑体验。' },
  { icon: Connection, title: 'Schema 驱动渲染', desc: '表单结构统一由 JSON Schema 描述，设计和预览共享同一份数据。' },
  { icon: MagicStick, title: 'Mock AI 生成', desc: '根据自然语言关键词生成不同表单，无 .env、无 API Key 也能完整演示。' },
  { icon: Collection, title: '本地持久化', desc: '使用 Pinia + localStorage 保存当前表单和历史表单记录。' },
]

const stacks = ['Vue3', 'TypeScript', 'Vite', 'Vue Router', 'Pinia', 'Element Plus', 'vuedraggable', 'Axios', 'localStorage']
const scenes = ['企业后台配置', '问卷收集', '活动报名', '实习申请', '信息采集', '用户反馈']
</script>

<template>
  <main class="page">
    <section class="hero-band">
      <div>
        <p class="eyebrow">AI Form Studio</p>
        <h1>智能低代码表单搭建平台</h1>
        <p>通过拖拽组件搭建表单，也可以输入自然语言需求，由 Mock AI 生成可编辑的 FormSchema。</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="router.push('/designer')">进入设计器</el-button>
          <el-button plain size="large" @click="router.push('/ai-generate')">AI 生成表单</el-button>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="section-title">
        <p class="eyebrow">Features</p>
        <h2>核心功能</h2>
      </div>
      <div class="feature-grid">
        <article v-for="feature in features" :key="feature.title" class="feature-card">
          <el-icon><component :is="feature.icon" /></el-icon>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </article>
      </div>
    </section>

    <section class="content-section two-column">
      <div class="panel">
        <div class="section-title">
          <p class="eyebrow">Workflow</p>
          <h2>使用流程</h2>
        </div>
        <el-steps direction="vertical" :active="4">
          <el-step title="选择组件或 AI 生成" description="从组件面板拖拽字段，或输入需求生成 Schema。" />
          <el-step title="配置字段属性" description="在右侧面板编辑 label、field、required、options 等属性。" />
          <el-step title="预览与校验" description="根据 Schema 动态渲染真实表单，提交时执行必填和格式校验。" />
          <el-step title="保存与导出" description="保存到 localStorage，也可以导入导出 JSON Schema。" />
        </el-steps>
      </div>

      <div class="panel">
        <div class="section-title">
          <p class="eyebrow">Stack & Scenes</p>
          <h2>技术栈与场景</h2>
        </div>
        <div class="tag-group">
          <el-tag v-for="stack in stacks" :key="stack" effect="plain">{{ stack }}</el-tag>
        </div>
        <el-divider />
        <div class="tag-group">
          <el-tag v-for="scene in scenes" :key="scene" type="success" effect="plain">
            <el-icon><Tickets /></el-icon>
            {{ scene }}
          </el-tag>
        </div>
      </div>
    </section>
  </main>
</template>
