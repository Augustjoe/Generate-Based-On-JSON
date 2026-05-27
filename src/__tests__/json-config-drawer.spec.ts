import { describe, it, expect } from 'vitest'
import { extractRenderFns } from '@/assets/render-fn-extractor'
import { parseJsonDrafts } from '@/components/JsonConfigDrawer'

describe('JsonConfigDrawer parser', () => {
  it('restores extracted render functions after parsing', () => {
    const source = {
      list: [
        {
          key: 'actions',
          render: () => 'mock-node',
        },
      ],
    }
    const { data, slots } = extractRenderFns(source)
    const drafts = {
      sectionA: JSON.stringify(data),
    }
    const sectionSlots = {
      sectionA: slots,
    }

    const result = parseJsonDrafts(drafts, sectionSlots)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const restored = result.sections[0].value as any
    expect(typeof restored.list[0].render).toBe('function')
    expect(restored.list[0].render()).toBe('mock-node')
  })

  it('returns parse error when one section JSON is invalid', () => {
    const result = parseJsonDrafts(
      {
        sectionA: '{invalid-json}',
      },
      {
        sectionA: {},
      },
    )
    expect(result.ok).toBe(false)
  })
})
