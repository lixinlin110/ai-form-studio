import type { FieldSchema, FormSchema, FormValue, FormValues, ValidateRule, ValidationResult } from '../types'

const isEmptyValue = (value: FormValue) => {
  if (Array.isArray(value)) return value.length === 0
  return value === null || value === undefined || value === ''
}

export const createValidateRules = (schema: FormSchema): ValidateRule[] =>
  schema.fields.map((field) => ({
    field: field.field,
    required: field.required,
    min: field.min,
    max: field.max,
    message: `${field.label} 校验失败`,
  }))

const validateSingleField = (field: FieldSchema, value: FormValue) => {
  if (field.required && isEmptyValue(value)) {
    return `${field.label} 为必填项`
  }

  if ((field.type === 'number' || field.type === 'rate') && typeof value === 'number') {
    if (typeof field.min === 'number' && value < field.min) return `${field.label} 不能小于 ${field.min}`
    if (typeof field.max === 'number' && value > field.max) return `${field.label} 不能大于 ${field.max}`
  }

  if (field.type === 'link' && typeof value === 'string' && value.trim()) {
    try {
      const url = new URL(value)
      if (!['http:', 'https:'].includes(url.protocol)) return `${field.label} 需要填写 http 或 https 链接`
    } catch {
      return `${field.label} 需要填写合法链接`
    }
  }

  return ''
}

export const validateFormValues = (schema: FormSchema, values: FormValues): ValidationResult => {
  const errors: Record<string, string> = {}

  schema.fields.forEach((field) => {
    const message = validateSingleField(field, values[field.field])
    if (message) errors[field.field] = message
  })

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
