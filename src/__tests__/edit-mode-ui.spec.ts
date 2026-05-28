import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import Form from '@/components/Form'
import SearchFrom from '@/components/SearchFrom'
import CustomTable from '@/components/CustomTable'
import FormView from '@/views/formView'
import TableView from '@/views/tableView'
import ProTableView from '@/views/proTable'

const mocked = vi.hoisted(() => ({
  openJsonConfigDrawerMock: vi.fn(),
  setDrawerPropsMock: vi.fn(),
  isEditMode: false,
}))

vi.mock('@/stores/appSettings', () => ({
  useAppSettingsStore: () => ({
    get isEdit() {
      return mocked.isEditMode
    },
    editPanelTrigger: 0,
  }),
}))

vi.mock('@/stores/appDrawerStore', () => ({
  useAppDrawerStore: () => ({
    setDrawerProps: mocked.setDrawerPropsMock,
  }),
}))

vi.mock('@/components/JsonConfigDrawer', () => ({
  openJsonConfigDrawer: mocked.openJsonConfigDrawerMock,
}))

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

beforeEach(() => {
  setActivePinia(createPinia())
})

const slotStub = defineComponent({
  setup(_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

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

describe('Edit mode entry button', () => {
  it('does not auto-open drawer when entering edit mode', async () => {
    mocked.isEditMode = false
    mocked.setDrawerPropsMock.mockReset()
    mocked.openJsonConfigDrawerMock.mockReset()

    const formWrapperPreview = shallowMount(FormView, {
      global: { stubs: { From: true, NCard: slotStub, NFlex: slotStub, NButton: slotStub, NRadio: slotStub } },
    })
    expect(formWrapperPreview.exists()).toBe(true)

    mocked.isEditMode = true
    const formWrapperEdit = shallowMount(FormView, {
      global: { stubs: { From: true, NCard: slotStub, NFlex: slotStub, NButton: slotStub, NRadio: slotStub } },
    })
    expect(formWrapperEdit.exists()).toBe(true)
    expect(mocked.openJsonConfigDrawerMock).not.toHaveBeenCalled()
  })

  it('mounts table/pro pages in edit mode without auto-opening drawer', () => {
    mocked.isEditMode = true
    mocked.openJsonConfigDrawerMock.mockReset()
    const tableWrapper = shallowMount(TableView, {
      global: { stubs: { ProTable: true, NButton: slotStub, NFlex: slotStub } },
    })
    const proWrapper = shallowMount(ProTableView, {
      global: { stubs: { ProTable: true, NButton: slotStub, NFlex: slotStub, NSpace: slotStub, NTag: slotStub } },
    })
    expect(tableWrapper.exists()).toBe(true)
    expect(proWrapper.exists()).toBe(true)
    expect(mocked.openJsonConfigDrawerMock).not.toHaveBeenCalled()
  })
})

describe('Registry apply write-back', () => {
  it('form view writes back formItems and formProps updates from Form', async () => {
    const wrapper = mount(FormView, {
      global: { stubs: { NCard: slotStub, NFlex: slotStub, NButton: slotStub, NRadio: slotStub } },
    })

    const formChild = wrapper.findComponent(Form)
    formChild.vm.$emit('update:formItems', [{ itemType: 'NInput', path: 'title', itemGiProps: { label: '标题' } }])
    await nextTick()
    expect((wrapper.findComponent(Form).props('formItems') as any[])[0]?.path).toBe('title')

    formChild.vm.$emit('update:formProps', { labelPlacement: 'top' })
    await nextTick()
    expect(wrapper.findComponent(Form).exists()).toBe(true)
  })

  it('table/pro pages write back all ProTable update channels', async () => {
    const createProTableStub = (latestProps: Record<string, any>) =>
      defineComponent({
      name: 'ProTable',
      props: ['formProps', 'formButtonItems', 'tableProps'],
      emits: ['update:formProps', 'update:formButtonItems', 'update:tableProps'],
      setup(props) {
        return () => h('div', [h('pre', { id: 'form-props-json' }, JSON.stringify(props.formProps)), h('pre', { id: 'form-buttons-json' }, JSON.stringify(props.formButtonItems)), h('pre', { id: 'table-props-json' }, JSON.stringify(props.tableProps))])
      },
      updated() {
        latestProps.formProps = (this as any).formProps
        latestProps.formButtonItems = (this as any).formButtonItems
        latestProps.tableProps = (this as any).tableProps
      },
      mounted() {
        latestProps.formProps = (this as any).formProps
        latestProps.formButtonItems = (this as any).formButtonItems
        latestProps.tableProps = (this as any).tableProps
      },
    })

    const latestTableProps: Record<string, any> = {}
    const tableStub = createProTableStub(latestTableProps)
    const tableWrapper = shallowMount(TableView, {
      global: { stubs: { ProTable: tableStub } },
    })
    const tableChild = tableWrapper.findComponent({ name: 'ProTable' })
    tableChild.vm.$emit('update:formProps', { inline: false })
    tableChild.vm.$emit('update:formButtonItems', [{ buttonText: '测试按钮', actionType: 'search' }])
    tableChild.vm.$emit('update:tableProps', { striped: false })
    await nextTick()
    expect(latestTableProps.formProps?.inline).toBe(false)
    expect(Array.isArray(latestTableProps.formButtonItems)).toBe(true)
    expect(latestTableProps.formButtonItems[0]?.buttonText).toBe('测试按钮')
    expect(latestTableProps.tableProps?.striped).toBe(false)

    const latestProProps: Record<string, any> = {}
    const proStub = createProTableStub(latestProProps)
    const proWrapper = shallowMount(ProTableView, {
      global: { stubs: { ProTable: proStub, NSpace: slotStub, NTag: slotStub, NButton: slotStub } },
    })
    const proChild = proWrapper.findComponent({ name: 'ProTable' })
    proChild.vm.$emit('update:formProps', { inline: false })
    proChild.vm.$emit('update:formButtonItems', [{ buttonText: '测试按钮', actionType: 'search' }])
    proChild.vm.$emit('update:tableProps', { striped: false })
    await nextTick()
    expect(latestProProps.formProps?.inline).toBe(false)
    expect(Array.isArray(latestProProps.formButtonItems)).toBe(true)
    expect(latestProProps.formButtonItems[0]?.buttonText).toBe('测试按钮')
    expect(latestProProps.tableProps?.striped).toBe(false)
  })
})
