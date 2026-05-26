export type FieldType =
  | 'input'
  | 'number'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'date'
  | 'rate'
  | 'switch'
  | 'link'

export type AiMode = 'mock' | 'remote'

export interface FieldOption {
  label: string
  value: string | number | boolean
}

export interface FieldSchema {
  id: string
  type: FieldType
  label: string
  field: string
  placeholder?: string
  required: boolean
  defaultValue?: string | number | boolean | Array<string | number | boolean> | null
  helpText?: string
  width: '50%' | '100%'
  options?: FieldOption[]
  min?: number
  max?: number
}

export interface FormSchema {
  id: string
  title: string
  description: string
  fields: FieldSchema[]
  createdAt: string
  updatedAt: string
}

export interface FormRecord {
  id: string
  schema: FormSchema
  createdAt: string
  updatedAt: string
}

export interface AiGenerateRequest {
  prompt: string
}

export interface AiGenerateResponse {
  mode: AiMode
  schema: FormSchema
  message: string
}

export interface ValidateRule {
  field: string
  required?: boolean
  min?: number
  max?: number
  message?: string
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export type FormValue = string | number | boolean | Array<string | number | boolean> | null

export type FormValues = Record<string, FormValue>

export interface ComponentMeta {
  type: FieldType
  label: string
  description: string
}

export interface ImportResult {
  valid: boolean
  schema?: FormSchema
  message?: string
}
