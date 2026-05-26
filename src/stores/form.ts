import { defineStore } from 'pinia'
import { generateFormSchema } from '../api/ai'
import type { AiGenerateRequest, FieldSchema, FormRecord, FormSchema } from '../types'
import { cloneFieldSchema, createEmptyFormSchema, createFieldSchema, normalizeSchema, touchSchema } from '../utils/schema'
import { getStorage, setStorage } from '../utils/storage'

const CURRENT_SCHEMA_KEY = 'current_schema'
const FORM_RECORDS_KEY = 'form_records'

type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

interface FormState {
  currentSchema: FormSchema
  selectedFieldId: string
  records: FormRecord[]
  aiStatus: RequestStatus
  schemaStatus: RequestStatus
  errorMessage: string
}

export const useFormStore = defineStore('form', {
  state: (): FormState => ({
    currentSchema: getStorage<FormSchema>(CURRENT_SCHEMA_KEY, createEmptyFormSchema()),
    selectedFieldId: '',
    records: getStorage<FormRecord[]>(FORM_RECORDS_KEY, []),
    aiStatus: 'idle',
    schemaStatus: 'idle',
    errorMessage: '',
  }),
  getters: {
    selectedField: (state): FieldSchema | null =>
      state.currentSchema.fields.find((field) => field.id === state.selectedFieldId) || null,
  },
  actions: {
    persistCurrent() {
      setStorage(CURRENT_SCHEMA_KEY, this.currentSchema)
    },
    persistRecords() {
      setStorage(FORM_RECORDS_KEY, this.records)
    },
    setCurrentSchema(schema: FormSchema) {
      this.currentSchema = normalizeSchema(schema)
      this.selectedFieldId = this.currentSchema.fields[0]?.id || ''
      this.persistCurrent()
    },
    updateFormMeta(payload: Partial<Pick<FormSchema, 'title' | 'description'>>) {
      this.currentSchema = touchSchema({
        ...this.currentSchema,
        ...payload,
      })
      this.persistCurrent()
    },
    addField(type: FieldSchema['type'], index?: number) {
      const field = createFieldSchema(type)
      const fields = [...this.currentSchema.fields]
      const insertIndex = typeof index === 'number' ? index : fields.length
      fields.splice(insertIndex, 0, field)
      this.currentSchema = touchSchema({ ...this.currentSchema, fields })
      this.selectedFieldId = field.id
      this.persistCurrent()
    },
    setFields(fields: FieldSchema[]) {
      this.currentSchema = touchSchema({ ...this.currentSchema, fields })
      this.persistCurrent()
    },
    selectField(fieldId: string) {
      this.selectedFieldId = fieldId
    },
    updateSelectedField(patch: Partial<FieldSchema>) {
      if (!this.selectedFieldId) return
      const fields = this.currentSchema.fields.map((field) =>
        field.id === this.selectedFieldId ? { ...field, ...patch } : field,
      )
      this.currentSchema = touchSchema({ ...this.currentSchema, fields })
      this.persistCurrent()
    },
    deleteField(fieldId: string) {
      const fields = this.currentSchema.fields.filter((field) => field.id !== fieldId)
      this.currentSchema = touchSchema({ ...this.currentSchema, fields })
      this.selectedFieldId = fields[0]?.id || ''
      this.persistCurrent()
    },
    duplicateField(fieldId: string) {
      const index = this.currentSchema.fields.findIndex((field) => field.id === fieldId)
      if (index < 0) return
      const copy = cloneFieldSchema(this.currentSchema.fields[index])
      const fields = [...this.currentSchema.fields]
      fields.splice(index + 1, 0, copy)
      this.currentSchema = touchSchema({ ...this.currentSchema, fields })
      this.selectedFieldId = copy.id
      this.persistCurrent()
    },
    clearCanvas() {
      this.currentSchema = touchSchema({ ...this.currentSchema, fields: [] })
      this.selectedFieldId = ''
      this.persistCurrent()
    },
    saveCurrentForm() {
      const now = new Date().toISOString()
      const existed = this.records.find((record) => record.schema.id === this.currentSchema.id)
      const record: FormRecord = {
        id: existed?.id || `record_${this.currentSchema.id}`,
        schema: touchSchema(this.currentSchema),
        createdAt: existed?.createdAt || now,
        updatedAt: now,
      }

      this.records = [record, ...this.records.filter((item) => item.id !== record.id)].slice(0, 40)
      this.currentSchema = record.schema
      this.persistRecords()
      this.persistCurrent()
    },
    loadRecord(recordId: string) {
      const record = this.records.find((item) => item.id === recordId)
      if (!record) return
      this.setCurrentSchema(record.schema)
    },
    deleteRecord(recordId: string) {
      this.records = this.records.filter((item) => item.id !== recordId)
      this.persistRecords()
    },
    async generateByAi(request: AiGenerateRequest) {
      try {
        this.aiStatus = 'loading'
        this.errorMessage = ''
        const response = await generateFormSchema(request)
        this.setCurrentSchema(response.schema)
        this.aiStatus = 'success'
        return response
      } catch (error) {
        this.aiStatus = 'error'
        this.errorMessage = error instanceof Error ? error.message : 'AI 生成失败'
        throw error
      }
    },
  },
})
