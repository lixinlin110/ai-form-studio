import type { ComponentMeta, FieldOption, FieldSchema, FieldType, FormSchema, FormValue, FormValues, ImportResult } from '../types'
import { createFieldName, createId } from './id'

export const componentMetas: ComponentMeta[] = [
  { type: 'input', label: '单行文本', description: '姓名、标题、公司名称' },
  { type: 'number', label: '数字输入', description: '年龄、人数、预算' },
  { type: 'textarea', label: '文本域', description: '备注、反馈、个人说明' },
  { type: 'radio', label: '单选框', description: '性别、状态、满意度' },
  { type: 'checkbox', label: '多选框', description: '兴趣、技能、偏好' },
  { type: 'select', label: '下拉选择', description: '城市、场次、分类' },
  { type: 'date', label: '日期选择', description: '报名日期、入职时间' },
  { type: 'rate', label: '评分组件', description: '满意度、推荐指数' },
  { type: 'switch', label: '开关组件', description: '是否接受通知' },
  { type: 'link', label: '文件链接', description: '简历链接、作品链接' },
]

const defaultOptions: FieldOption[] = [
  { label: '选项一', value: 'option_1' },
  { label: '选项二', value: 'option_2' },
]

export const createEmptyFormSchema = (): FormSchema => {
  const now = new Date().toISOString()

  return {
    id: createId('form'),
    title: '未命名表单',
    description: '通过拖拽组件或 AI 生成 Schema 快速搭建表单。',
    fields: [],
    createdAt: now,
    updatedAt: now,
  }
}

export const getDefaultValueByType = (type: FieldType): FormValue => {
  if (type === 'checkbox') return []
  if (type === 'switch') return false
  if (type === 'number' || type === 'rate') return 0
  return ''
}

export const createFieldSchema = (type: FieldType): FieldSchema => {
  const meta = componentMetas.find((item) => item.type === type)
  const fieldName = createFieldName(type)
  const optionTypes: FieldType[] = ['radio', 'checkbox', 'select']

  return {
    id: createId('field'),
    type,
    label: meta?.label || '新字段',
    field: fieldName,
    placeholder: type === 'select' || type === 'date' ? '请选择' : '请输入',
    required: false,
    defaultValue: getDefaultValueByType(type),
    helpText: '',
    width: '100%',
    options: optionTypes.includes(type) ? [...defaultOptions] : undefined,
    min: type === 'number' ? 0 : undefined,
    max: type === 'number' || type === 'rate' ? 5 : undefined,
  }
}

export const cloneFieldSchema = (field: FieldSchema): FieldSchema => ({
  ...field,
  id: createId('field'),
  label: `${field.label} 副本`,
  field: createFieldName(field.field),
  options: field.options ? field.options.map((item) => ({ ...item })) : undefined,
})

export const touchSchema = (schema: FormSchema): FormSchema => ({
  ...schema,
  updatedAt: new Date().toISOString(),
})

export const createFormValues = (schema: FormSchema): FormValues => {
  return schema.fields.reduce<FormValues>((values, field) => {
    values[field.field] = field.defaultValue ?? getDefaultValueByType(field.type)
    return values
  }, {})
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isFieldType = (value: unknown): value is FieldType =>
  typeof value === 'string' && componentMetas.some((item) => item.type === value)

export const normalizeSchema = (schema: FormSchema): FormSchema => {
  const now = new Date().toISOString()

  return {
    ...schema,
    id: schema.id || createId('form'),
    title: schema.title || '导入表单',
    description: schema.description || '由 JSON Schema 导入生成。',
    fields: schema.fields.map((field) => ({
      ...field,
      id: field.id || createId('field'),
      required: Boolean(field.required),
      width: field.width === '50%' ? '50%' : '100%',
      defaultValue: field.defaultValue ?? getDefaultValueByType(field.type),
      options: field.options?.map((option) => ({ ...option })),
    })),
    createdAt: schema.createdAt || now,
    updatedAt: now,
  }
}

export const parseSchemaFromJson = (jsonText: string): ImportResult => {
  try {
    const parsed = JSON.parse(jsonText) as unknown

    if (!isRecord(parsed)) {
      return { valid: false, message: 'Schema 必须是一个 JSON 对象' }
    }

    if (typeof parsed.title !== 'string' || !Array.isArray(parsed.fields)) {
      return { valid: false, message: 'Schema 至少需要包含 title 和 fields 字段' }
    }

    const fields: FieldSchema[] = []
    for (const item of parsed.fields) {
      if (!isRecord(item) || !isFieldType(item.type) || typeof item.label !== 'string' || typeof item.field !== 'string') {
        return { valid: false, message: 'fields 中每一项都必须包含合法的 type、label 和 field' }
      }

      fields.push({
        id: typeof item.id === 'string' ? item.id : createId('field'),
        type: item.type,
        label: item.label,
        field: item.field,
        placeholder: typeof item.placeholder === 'string' ? item.placeholder : '',
        required: Boolean(item.required),
        defaultValue: item.defaultValue as FormValue,
        helpText: typeof item.helpText === 'string' ? item.helpText : '',
        width: item.width === '50%' ? '50%' : '100%',
        options: Array.isArray(item.options)
          ? item.options
              .filter(isRecord)
              .map((option) => ({
                label: String(option.label ?? ''),
                value: typeof option.value === 'boolean' || typeof option.value === 'number' ? option.value : String(option.value ?? ''),
              }))
          : undefined,
        min: typeof item.min === 'number' ? item.min : undefined,
        max: typeof item.max === 'number' ? item.max : undefined,
      })
    }

    return {
      valid: true,
      schema: normalizeSchema({
        id: typeof parsed.id === 'string' ? parsed.id : createId('form'),
        title: parsed.title,
        description: typeof parsed.description === 'string' ? parsed.description : '',
        fields,
        createdAt: typeof parsed.createdAt === 'string' ? parsed.createdAt : new Date().toISOString(),
        updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
      }),
    }
  } catch {
    return { valid: false, message: 'JSON 解析失败，请检查格式是否正确' }
  }
}

export const stringifySchema = (schema: FormSchema) => JSON.stringify(schema, null, 2)
