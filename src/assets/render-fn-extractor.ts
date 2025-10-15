// render-fn-extractor.ts
export type AnyObj = Record<string, any>
export type RenderLikeFn = (...args: any[]) => any // 实际返回 JSX.Element | VNode | HTMLElement

const PLACEHOLDER_PREFIX = '__render_slot__'

export interface ExtractOptions {
  /**
   * 自定义筛选规则：返回 true 表示该 (key, value) 应被提取
   */
  shouldExtract?: (key: string, value: unknown, owner?: AnyObj) => boolean
}

/**
 * 默认筛选规则：
 * - key 以 render 开头（如 render、renderIcon、renderCell...）
 * - 或 key 以 Icon 结尾（如 icon / suffixIcon / renderIcon）
 * - 并且 key 不是 on* 事件
 * - 且值是函数
 */
function defaultShouldExtract(key: string, value: unknown): boolean {
  if (typeof value !== 'function') return false
  if (/^on[A-Z_]/.test(key)) return false // 排除 onClick/onUpdateValue 等事件
  if (/^render/.test(key)) return true
  if (/Icon$/.test(key) || /^icon$/i.test(key)) return true
  return false
}

export interface ExtractResult<T> {
  data: T
  slots: Record<string, RenderLikeFn>
}

/**
 * 深拷贝并提取渲染函数：把渲染函数替换为唯一 key（字符串），并把函数存到 slots
 */
export function extractRenderFns<T>(input: T, options: ExtractOptions = {}): ExtractResult<T> {
  const shouldExtract = options.shouldExtract ?? defaultShouldExtract
  const slots: Record<string, RenderLikeFn> = {}
  let seq = 0

  const clone = (val: any, owner?: AnyObj): any => {
    if (Array.isArray(val)) {
      return val.map((item) => clone(item, owner))
    }
    if (val && typeof val === 'object') {
      const out: AnyObj = Array.isArray(val) ? [] : {}
      for (const [k, v] of Object.entries(val)) {
        if (shouldExtract(k, v, val)) {
          const key = `${PLACEHOLDER_PREFIX}${++seq}`
          slots[key] = v as RenderLikeFn
          out[k] = key // 在原位置用 key 占位
        } else {
          out[k] = clone(v, val)
        }
      }
      return out as typeof val
    }
    // 基本类型直接返回
    return val
  }

  const data = clone(input) as T
  return { data, slots }
}

/**
 * 还原：把占位 key 替换回函数
 */
export function restoreRenderFns<T>(input: T, slots: Record<string, RenderLikeFn>): T {
  const restore = (val: any): any => {
    if (Array.isArray(val)) {
      return val.map(restore)
    }
    if (val && typeof val === 'object') {
      const out: AnyObj = Array.isArray(val) ? [] : {}
      for (const [k, v] of Object.entries(val)) {
        if (typeof v === 'string' && v.startsWith(PLACEHOLDER_PREFIX) && v in slots) {
          out[k] = slots[v]
        } else {
          out[k] = restore(v)
        }
      }
      return out as typeof val
    }
    return val
  }
  return restore(input) as T
}
