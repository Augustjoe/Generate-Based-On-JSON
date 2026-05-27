import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Form from '@/components/Form'
import SearchFrom from '@/components/SearchFrom'
import CustomTable from '@/components/CustomTable'

vi.mock('@/utils/dynamicComponent', () => ({
  getNaiveComponent: vi.fn(() =>
    defineComponent({
      name: 'MockNaiveInput',
      props: ['value'],
      emits: ['update:value'],
      setup() {
        return () => h('input')
      },
    }),
  ),
}))

vi.mock('sortablejs', () => ({
  default: {
    create: () => ({ destroy: () => {} }),
  },
}))

describe('Edit mode UI cleanup', () => {
  it('does not render legacy FormEditorButton in Form component', () => {
    const wrapper = shallowMount(Form, {
      props: {
        isEdit: true,
        formData: { name: '' },
        formItems: [
          {
            itemType: 'NInput',
            path: 'name',
          },
        ],
      },
    })
    expect(wrapper.findComponent({ name: 'FormEditorButton' }).exists()).toBe(false)
  })

  it('does not render legacy FormEditorButton in SearchFrom component', () => {
    const wrapper = shallowMount(SearchFrom, {
      props: {
        isEdit: true,
        formData: {},
        formItems: [],
        ButtonItems: [{ buttonText: '查询', actionType: 'search' }],
      },
      global: {
        stubs: {
          Form: true,
        },
      },
    })
    expect(wrapper.findComponent({ name: 'FormEditorButton' }).exists()).toBe(false)
  })

  it('does not render legacy FormEditorButton in CustomTable component', () => {
    const wrapper = shallowMount(CustomTable, {
      props: {
        isEdit: true,
        columns: [{ title: 'Name', key: 'name' }],
        data: [{ name: 'A' }],
        tableButtons: [{ buttonText: '新增', actionType: 'add' }],
      },
      global: {
        stubs: {
          NDataTable: true,
        },
      },
    })
    expect(wrapper.findComponent({ name: 'FormEditorButton' }).exists()).toBe(false)
  })
})
