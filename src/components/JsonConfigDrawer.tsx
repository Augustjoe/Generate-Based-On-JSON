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

type ParseResult =
  | { ok: true; sections: ParsedSection[] }
  | { ok: false; error: string; sectionKey: string }

export const parseJsonDrafts = (
  drafts: Record<string, string>,
  sectionSlots: Record<string, Record<string, RenderLikeFn>>,
): ParseResult => {
  const parsed: ParsedSection[] = []
  for (const [key, raw] of Object.entries(drafts)) {
    try {
      const jsonData = JSON.parse(raw)
      parsed.push({
        key,
        value: restoreRenderFns(jsonData, sectionSlots[key] || {}),
      })
    } catch {
      return { ok: false, error: `Section ${key} JSON parse failed`, sectionKey: key }
    }
  }
  return { ok: true, sections: parsed }
}

const JsonConfigDrawer = defineComponent({
  name: 'JsonConfigDrawer',
  props: {
    title: {
      type: String,
      default: 'Config Panel',
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

    const clearAllErrors = () => {
      Object.keys(errors).forEach((key) => delete errors[key])
    }

    const syncDrafts = () => {
      Object.keys(drafts).forEach((key) => delete drafts[key])
      Object.keys(sourceDrafts).forEach((key) => delete sourceDrafts[key])
      Object.keys(sectionSlots).forEach((key) => delete sectionSlots[key])
      clearAllErrors()

      props.sections.forEach((section) => {
        const { data, slots } = extractRenderFns(section.value)
        const json = JSON.stringify(data, null, 2)
        drafts[section.key] = json
        sourceDrafts[section.key] = json
        sectionSlots[section.key] = slots
      })
    }

    const applyChanges = () => {
      clearAllErrors()
      const result = parseJsonDrafts(drafts, sectionSlots)
      if (!result.ok) {
        errors[result.sectionKey] = result.error
        window.$message?.error(result.error)
        return
      }
      props.onApply(result.sections)
      clearAllErrors()
      window.$message?.success('Config applied')
    }

    watch(
      () => props.sections,
      () => syncDrafts(),
      { deep: true, immediate: true },
    )

    return () => (
      <div style={{ padding: '12px', height: '100%', overflowY: 'auto' }}>
        <NAlert type="info" style={{ marginBottom: '12px' }}>
          JSON sections are validated before apply.
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
                  delete errors[section.key]
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
                  Reset
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
              clearAllErrors()
              window.$message?.info('Changes cancelled')
            }}
          >
            Cancel
          </NButton>
          <NButton type="primary" onClick={applyChanges}>
            Apply
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
