import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTemplateStore } from '@/stores/templateStore'

describe('template store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with mock templates and supports export', () => {
    const store = useTemplateStore()
    store.init()
    expect(store.templates.length).toBeGreaterThan(0)
    const text = store.exportTemplateText(store.templates[0].id)
    expect(text).toContain('"id"')
  })

  it('imports valid template and rejects invalid template', () => {
    const store = useTemplateStore()
    store.init()
    const valid = JSON.stringify({
      id: 'tpl-import-01',
      name: '导入模板',
      type: 'form',
      description: 'imported',
      config: {
        formItems: [],
      },
    })
    const imported = store.importTemplateFromText(valid)
    expect(imported.id).toBe('tpl-import-01')
    expect(store.getById('tpl-import-01')).toBeTruthy()

    expect(() =>
      store.importTemplateFromText(
        JSON.stringify({
          id: 'bad',
          name: 'bad',
          type: 'proTable',
          description: 'bad',
          config: { formItems: [] },
        }),
      ),
    ).toThrow()
  })
})
