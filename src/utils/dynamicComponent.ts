import { defineAsyncComponent, type Component } from 'vue'

type NaiveModule = Record<string, Component | undefined> & {
  default?: Component
}

// Vite will expand this glob at build time into a path -> loader map.
const naiveComponentModules = import.meta.glob<NaiveModule>(
  '../../node_modules/naive-ui/es/*/index.mjs',
)

function toKebabCase(str: string) {
  return str
    .replace(/^N/, '')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

const componentCache = new Map<string, Component>()

/**
 * Dynamically resolve a Naive UI async component by component name.
 * @param name Component name, for example "NInput" or "NDatePicker".
 */
export function getNaiveComponent(name: string) {
  if (componentCache.has(name)) {
    return componentCache.get(name)
  }

  const kebabName = toKebabCase(name)
  const modulePath = `../../node_modules/naive-ui/es/${kebabName}/index.mjs`
  const loader = naiveComponentModules[modulePath]

  if (!loader) {
    console.warn(`[dynamicComponent] Naive UI component "${name}" was not found.`)
    return null
  }

  const component = defineAsyncComponent(async () => {
    const module = await loader()
    const resolved = module[name] || module.default

    if (!resolved) {
      throw new Error(`[dynamicComponent] Naive UI module found, but "${name}" is not exported.`)
    }

    return resolved
  })

  componentCache.set(name, component)
  return component
}
