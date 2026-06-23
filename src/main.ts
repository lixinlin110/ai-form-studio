import App from './App.vue'
import {
  ElAside,
  ElButton,
  ElCheckbox,
  ElCheckboxGroup,
  ElContainer,
  ElDatePicker,
  ElDivider,
  ElForm,
  ElFormItem,
  ElHeader,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElOption,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSkeleton,
  ElStep,
  ElSteps,
  ElSwitch,
  ElTag,
} from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import router from './router'
import './style.css'

const app = createApp(App)
const elementPlusComponents = [
  ElAside,
  ElButton,
  ElCheckbox,
  ElCheckboxGroup,
  ElContainer,
  ElDatePicker,
  ElDivider,
  ElForm,
  ElFormItem,
  ElHeader,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElOption,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSkeleton,
  ElStep,
  ElSteps,
  ElSwitch,
  ElTag,
]

elementPlusComponents.forEach((component) => app.use(component))

app.use(createPinia()).use(router).mount('#app')
