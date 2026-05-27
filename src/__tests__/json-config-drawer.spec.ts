import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { extractRenderFns } from '@/assets/render-fn-extractor'
import JsonConfigDrawer, { parseJsonDrafts } from '@/components/JsonConfigDrawer'

vi.mock('vue-codemirror', () => ({
  Codemirror: defineComponent({
    name: 'Codemirror',
    props: { modelValue: { type: String, default: '' } },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      return () =>
        h('textarea', {
          value: props.modelValue,
          onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLTextAreaElement).value),
        })
    },
  }),
}))

vi.mock('@codemirror/lang-javascript', () => ({
  javascript: () => ({}),
}))

describe('JsonConfigDrawer parser', () => {
  beforeEach(() => {
    ;(window as any).$message = {
      error: vi.fn(),
      success: vi.fn(),
      info: vi.fn(),
    }
  })

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
    if (result.ok) return
    expect(result.sectionKey).toBe('sectionA')
  })

  it('does not call onApply and shows section error for invalid JSON, then clears after edit', async () => {
    const onApply = vi.fn()
    const wrapper = mount(JsonConfigDrawer, {
      props: {
        sections: [
          {
            key: 'formItems',
            title: 'Form Items',
            value: [{ itemType: 'NInput', path: 'name' }],
          },
        ],
        onApply,
      },
      global: {
        stubs: {
          NAlert: defineComponent({ setup(_, { slots }) { return () => h('div', slots.default?.()) } }),
          NCard: defineComponent({ setup(_, { slots }) { return () => h('section', slots.default?.()) } }),
          NFlex: defineComponent({ setup(_, { slots }) { return () => h('div', slots.default?.()) } }),
          NText: defineComponent({ setup(_, { slots }) { return () => h('span', slots.default?.()) } }),
          NButton: defineComponent({
            props: {
              onClick: Function,
            },
            setup(props, { slots }) {
              return () => h('button', { onClick: () => props.onClick?.() }, slots.default?.())
            },
          }),
        },
      },
    })

    await wrapper.find('textarea').setValue('{invalid-json}')
    const buttons = wrapper.findAll('button')
    await buttons[buttons.length - 1].trigger('click')
    await wrapper.vm.$nextTick()

    expect(onApply).not.toHaveBeenCalled()
    expect((window as any).$message.error).toHaveBeenCalledWith('Section formItems JSON parse failed')

    await wrapper.find('textarea').setValue('[]')
    await wrapper.vm.$nextTick()
  })
})
