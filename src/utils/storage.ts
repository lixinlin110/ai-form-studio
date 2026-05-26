const APP_PREFIX = 'ai-form-studio'

const buildKey = (key: string) => `${APP_PREFIX}:${key}`

export const getStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(buildKey(key))
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export const setStorage = <T>(key: string, value: T) => {
  localStorage.setItem(buildKey(key), JSON.stringify(value))
}

export const removeStorage = (key: string) => {
  localStorage.removeItem(buildKey(key))
}

export const clearAppStorage = () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(`${APP_PREFIX}:`))
    .forEach((key) => localStorage.removeItem(key))
}
