export const createId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

export const createFieldName = (type: string) =>
  `${type}_${Math.random().toString(36).slice(2, 6)}`
