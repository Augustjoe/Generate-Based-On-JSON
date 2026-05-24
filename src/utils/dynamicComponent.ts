import { defineAsyncComponent } from 'vue'

// 将 PascalCase（例如 "NInput"）转换为 kebab-case（例如 "input"）
// 也支持像 "NDatePicker" 转换为 "date-picker"
function toKebabCase(str: string) {
  return str
    .replace(/^N/, '')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

// 缓存已创建的组件包装器，防止组件在重新 render 时被销毁重装导致失去焦点
const componentCache = new Map<string, any>()

/**
 * 动态获取 Naive UI 异步组件
 * @param name 组件名称 (例如 "NInput", "NSelect")
 */
export function getNaiveComponent(name: string) {
  if (componentCache.has(name)) {
    return componentCache.get(name)
  }

  const kebabName = toKebabCase(name)
  const component = defineAsyncComponent(() =>
    import(`../../node_modules/naive-ui/es/${kebabName}/index.mjs`).then(
      (m) => m[name] || m.default
    )
  )
  
  componentCache.set(name, component)
  return component
}

