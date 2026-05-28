import { describe, expect, it } from 'vitest'
import { createMockTemplates, validateTemplateAsset } from '@/utils/templateSchema'

describe('template schema', () => {
  it('creates mock templates for list page', () => {
    const templates = createMockTemplates()
    expect(templates.length).toBeGreaterThanOrEqual(2)
    expect(templates[0].id).toBeTruthy()
    expect(templates[0].config).toBeTruthy()
  })

  it('validates a valid proTable template', () => {
    const result = validateTemplateAsset({
      id: 'tpl-01',
      name: '订单模板',
      type: 'proTable',
      description: 'desc',
      config: {
        formItems: [],
        columns: [],
      },
    })
    expect(result.ok).toBe(true)
  })

  it('rejects invalid template without required fields', () => {
    const result = validateTemplateAsset({
      id: 'tpl-02',
      name: '非法模板',
      type: 'proTable',
      description: 'desc',
      config: {
        formItems: [],
      },
    })
    expect(result.ok).toBe(false)
  })
})
