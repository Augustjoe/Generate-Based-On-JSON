import { defineComponent, reactive, watch } from 'vue'
import { NAlert, NButton, NCard, NFlex, NText } from 'naive-ui'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { extractRenderFns, restoreRenderFns, type RenderLikeFn } from '@/assets/render-fn-extractor'
import { useDrawer } from '@/components/useDrawer'

export type JsonConfigSection = {
  key: string
  title: string
  value: unknown
}

type ParsedSection = {
  key: string
  value: unknown
}

export const parseJsonDrafts = (
  drafts: Record<string, string>,
  sectionSlots: Record<string, Record<string, RenderLikeFn>>,
): { ok: true; sections: ParsedSection[] } | { ok: false; error: string } => {
  const parsed: ParsedSection[] = []
  for (const [key, raw] of Object.entries(drafts)) {
    try {
      const jsonData = JSON.parse(raw)
      parsed.push({
        key,
        value: restoreRenderFns(jsonData, sectionSlots[key] || {}),
      })
    } catch (error) {
      return { ok: false, error: `分区 ${key} JSON 解析失败` }
    }
  }
  return { ok: true, sections: parsed }
}

const JsonConfigDrawer = defineComponent({
  name: 'JsonConfigDrawer',
  props: {
    title: {
      type: String,
      default: '配置面板',
    },
    sections: {
      type: Array as () => JsonConfigSection[],
      required: true,
      default: () => [],
    },
    onApply: {
      type: Function as unknown as () => (sections: ParsedSection[]) => void,
      required: true,
    },
  },
  setup(props) {
    const drafts = reactive<Record<string, string>>({})
    const sourceDrafts = reactive<Record<string, string>>({})
    const sectionSlots = reactive<Record<string, Record<string, RenderLikeFn>>>({})
    const errors = reactive<Record<string, string>>({})

    const syncDrafts = () => {
      Object.keys(drafts).forEach((key) => delete drafts[key])
      Object.keys(sourceDrafts).forEach((key) => delete sourceDrafts[key])
      Object.keys(sectionSlots).forEach((key) => delete sectionSlots[key])
      Object.keys(errors).forEach((key) => delete errors[key])

      props.sections.forEach((section) => {
        const { data, slots } = extractRenderFns(section.value)
        const json = JSON.stringify(data, null, 2)
        drafts[section.key] = json
        sourceDrafts[section.key] = json
        sectionSlots[section.key] = slots
      })
    }

    const applyChanges = () => {
      const result = parseJsonDrafts(drafts, sectionSlots)
      if (!result.ok) {
        window.$message?.error(result.error)
        return
      }
      props.onApply(result.sections)
      window.$message?.success('配置已应用')
    }

    watch(
      () => props.sections,
      () => syncDrafts(),
      { deep: true, immediate: true },
    )

    return () => (
      <div style={{ padding: '12px', height: '100%', overflowY: 'auto' }}>
        <NAlert type="info" style={{ marginBottom: '12px' }}>
          当前仅支持 JSON 编辑。点击“应用配置”前会校验所有分区 JSON。
        </NAlert>
        <NFlex vertical size={12}>
          {props.sections.map((section) => (
            <NCard
              key={section.key}
              title={section.title}
              contentStyle={{ paddingTop: '10px' }}
              style={{ borderRadius: '8px' }}
            >
              <Codemirror
                modelValue={drafts[section.key] || ''}
                onUpdate:modelValue={(val: string) => {
                  drafts[section.key] = val
                }}
                extensions={[javascript()]}
                style={{ minHeight: '180px', border: '1px solid var(--n-border-color)' }}
              />
              {errors[section.key] && (
                <NText depth={3} style={{ color: 'var(--n-error-color)', marginTop: '8px', display: 'block' }}>
                  {errors[section.key]}
                </NText>
              )}
              <NFlex justify="end" style={{ marginTop: '10px' }}>
                <NButton
                  size="small"
                  onClick={() => {
                    drafts[section.key] = sourceDrafts[section.key]
                    delete errors[section.key]
                  }}
                >
                  重置
                </NButton>
              </NFlex>
            </NCard>
          ))}
        </NFlex>
        <NFlex justify="end" style={{ marginTop: '14px' }}>
          <NButton
            onClick={() => {
              props.sections.forEach((section) => {
                drafts[section.key] = sourceDrafts[section.key]
              })
              window.$message?.info('已恢复初始配置')
            }}
          >
            取消修改
          </NButton>
          <NButton type="primary" onClick={applyChanges}>
            应用配置
          </NButton>
        </NFlex>
      </div>
    )
  },
})

export const openJsonConfigDrawer = (options: {
  title: string
  sections: JsonConfigSection[]
  onApply: (sections: ParsedSection[]) => void
}) => {
  useDrawer(
    {
      default: () => (
        <JsonConfigDrawer title={options.title} sections={options.sections} onApply={options.onApply} />
      ),
      header: () => <div>{options.title}</div>,
    },
    {
      placement: 'right',
      width: 560,
      show: true,
    },
  )
}

export default JsonConfigDrawer
