import axios from 'axios'
import type { AiGenerateRequest, AiGenerateResponse, AiMode, FieldSchema, FormSchema } from '../types'
import { createFieldSchema, touchSchema } from '../utils/schema'

const aiMode = (import.meta.env.VITE_AI_MODE || 'mock') as AiMode
const apiBaseURL = import.meta.env.VITE_AI_API_BASE_URL || ''
const apiKey = import.meta.env.VITE_AI_API_KEY || ''

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const createField = (type: FieldSchema['type'], patch: Partial<FieldSchema>): FieldSchema => ({
  ...createFieldSchema(type),
  ...patch,
})

const buildSchema = (title: string, description: string, fields: FieldSchema[]): FormSchema => {
  const now = new Date().toISOString()

  return touchSchema({
    id: `form_${Date.now()}`,
    title,
    description,
    fields,
    createdAt: now,
    updatedAt: now,
  })
}

const createInternshipSchema = () =>
  buildSchema('实习报名表', '用于收集实习申请人的基础信息、简历和可实习时间。', [
    createField('input', { label: '姓名', field: 'name', placeholder: '请输入真实姓名', required: true, helpText: '请填写真实姓名' }),
    createField('input', { label: '手机号', field: 'phone', placeholder: '请输入手机号', required: true }),
    createField('input', { label: '学校', field: 'school', placeholder: '请输入学校名称', required: true }),
    createField('input', { label: '专业', field: 'major', placeholder: '请输入专业', required: true, width: '50%' }),
    createField('select', {
      label: '年级',
      field: 'grade',
      required: true,
      width: '50%',
      options: [
        { label: '大一', value: 'freshman' },
        { label: '大二', value: 'sophomore' },
        { label: '大三', value: 'junior' },
        { label: '大四', value: 'senior' },
        { label: '研究生', value: 'graduate' },
      ],
    }),
    createField('link', { label: '简历链接', field: 'resumeUrl', placeholder: '请输入在线简历或作品集链接', required: true }),
    createField('date', { label: '可开始实习时间', field: 'startDate', required: true, width: '50%' }),
    createField('textarea', { label: '自我介绍', field: 'introduction', placeholder: '请简要说明你的优势', required: false }),
  ])

const createFeedbackSchema = () =>
  buildSchema('用户反馈表', '用于收集产品体验、满意度和用户建议。', [
    createField('rate', { label: '满意度评分', field: 'satisfaction', required: true, min: 1, max: 5, helpText: '1 分最低，5 分最高' }),
    createField('radio', {
      label: '是否愿意推荐',
      field: 'recommend',
      required: true,
      options: [
        { label: '愿意', value: 'yes' },
        { label: '暂不确定', value: 'maybe' },
        { label: '不愿意', value: 'no' },
      ],
    }),
    createField('checkbox', {
      label: '遇到的问题',
      field: 'issues',
      options: [
        { label: '页面加载慢', value: 'slow' },
        { label: '功能不清晰', value: 'unclear' },
        { label: '操作流程长', value: 'complex' },
      ],
    }),
    createField('textarea', { label: '反馈内容', field: 'feedback', placeholder: '请填写你的建议', required: true }),
    createField('input', { label: '联系方式', field: 'contact', placeholder: '手机号 / 邮箱 / 微信号' }),
  ])

const createActivitySchema = () =>
  buildSchema('活动报名表', '用于收集活动参与者报名信息。', [
    createField('input', { label: '姓名', field: 'name', required: true }),
    createField('input', { label: '手机号', field: 'phone', required: true }),
    createField('select', {
      label: '活动场次',
      field: 'session',
      required: true,
      options: [
        { label: '上午场', value: 'morning' },
        { label: '下午场', value: 'afternoon' },
        { label: '晚间场', value: 'evening' },
      ],
    }),
    createField('number', { label: '参与人数', field: 'participants', required: true, min: 1, max: 10, defaultValue: 1 }),
    createField('switch', { label: '是否接收活动通知', field: 'notify', defaultValue: true }),
    createField('textarea', { label: '备注', field: 'remark', placeholder: '特殊需求可在此说明' }),
  ])

const createGenericSchema = () =>
  buildSchema('通用信息收集表', '根据自然语言需求生成的通用表单，可在设计器中继续调整。', [
    createField('input', { label: '姓名', field: 'name', required: true }),
    createField('input', { label: '联系方式', field: 'contact', required: true }),
    createField('select', {
      label: '信息类型',
      field: 'category',
      options: [
        { label: '咨询', value: 'consult' },
        { label: '报名', value: 'signup' },
        { label: '反馈', value: 'feedback' },
      ],
    }),
    createField('textarea', { label: '详细说明', field: 'description', required: true }),
  ])

const generateMockSchema = (prompt: string) => {
  if (/实习|简历|求职|申请/.test(prompt)) return createInternshipSchema()
  if (/反馈|满意|建议|评价/.test(prompt)) return createFeedbackSchema()
  if (/活动|报名|场次|参与/.test(prompt)) return createActivitySchema()
  return createGenericSchema()
}

export const getAiMode = (): AiMode => (aiMode === 'remote' && apiBaseURL && apiKey ? 'remote' : 'mock')

export const generateFormSchema = async (request: AiGenerateRequest): Promise<AiGenerateResponse> => {
  await sleep(700)

  // 默认走 mock。未来接入真实服务时，只需要在这里替换请求地址和响应映射。
  if (aiMode === 'remote' && apiBaseURL && apiKey) {
    const response = await axios.post<FormSchema>(
      `${apiBaseURL}/form-schema/generate`,
      request,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    )

    return {
      mode: 'remote',
      schema: touchSchema(response.data),
      message: '已通过远程 AI 服务生成表单 Schema',
    }
  }

  return {
    mode: 'mock',
    schema: generateMockSchema(request.prompt),
    message: '当前为 Mock AI 模式，已根据关键词生成表单 Schema',
  }
}
