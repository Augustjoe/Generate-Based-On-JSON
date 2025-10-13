import { defineComponent } from 'vue'
import {
  NDataTable,
  NFlex,
  NButton,
  NIcon,
  type DataTableColumns,
  type DataTableProps,
} from 'naive-ui'
import FormEditorButton from './FormEditorButton'
import { EditSettings24Regular, Settings32Regular, TableSettings24Regular } from '@vicons/fluent'

export default defineComponent({
  name: 'CustomTable',
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array as () => DataTableColumns<Record<string, any>>,
      required: true,
      default: () => [],
    },
    data: {
      type: Array as () => Record<string, any>[],
      required: true,
      default: () => [],
    },
    tableButtons: {
      type: Array as () => tableButtonItem,
      required: false,
      default: () => [],
    },
    tableProps: {
      type: Object as () => DataTableProps,
      required: false,
      default: () => ({}),
    },
    tableDivStyle: {
      type: Object as () => Record<string, any>,
      required: false,
      default: () => ({}),
    },
    tableButtonDivStyle: {
      type: Object as () => Record<string, any>,
      required: false,
      default: () => ({}),
    },
  },
  emits: ['update:tableButtons', 'update:columns', 'update:tableProps'],
  setup(props, { emit }) {
    const tableButtons = ref<tableButtonItem>(props.tableButtons || [])
    const columns = ref<DataTableColumns<Record<string, any>>>(props.columns || [])
    const tableProps = ref<Partial<DataTableProps>>(props.tableProps || [])

    return () => (
      <div
        style={{
          height: '100%',
          padding: '10px',
          display: 'grid',
          minHeight: 0,
          gridTemplateRows: 'auto 1fr',
          ...props.tableDivStyle,
        }}
      >
        <div
          style={{
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            ...props.tableButtonDivStyle,
          }}
        >
          <NFlex style={{ height: '100%' }} justify="center" align="center">
            {tableButtons.value.map((item) => {
              if (item.type === 'custom' && item.render) {
                return item.render()
              } else if (item.type !== 'custom') {
                return <NButton {...item}>{item.buttonText}</NButton>
              }
            })}
            {props.isEdit && (
              <FormEditorButton
                style={{}}
                formItems={tableButtons.value}
                buttonProps={{
                  renderIcon: () => <NIcon component={<EditSettings24Regular />}></NIcon>,
                  type: 'info',
                }}
                onUpdate:formItems={(items: tableButtonItem) => {
                  tableButtons.value = items
                  emit('update:tableButtons', tableButtons.value)
                }}
                propoverTitle="表格按钮配置"
              ></FormEditorButton>
            )}
          </NFlex>

          {props.isEdit && (
            <NFlex align="center">
              <FormEditorButton
                style={{}}
                formProps={tableProps.value}
                buttonProps={{
                  renderIcon: () => <NIcon component={<TableSettings24Regular />}></NIcon>,
                  type: 'info',
                }}
                onUpdate:formProps={(items: DataTableProps) => {
                  tableProps.value = items
                  emit('update:tableProps', tableProps.value)
                }}
                propoverTitle="表格配置"
              ></FormEditorButton>
              <FormEditorButton
                style={{}}
                formItems={columns.value}
                buttonProps={{
                  renderIcon: () => <NIcon component={<Settings32Regular />}></NIcon>,
                  type: 'info',
                }}
                onUpdate:formItems={(items: DataTableColumns<Record<string, any>>) => {
                  columns.value = items
                  emit('update:columns', columns.value)
                }}
                propoverTitle="列配置"
              ></FormEditorButton>
            </NFlex>
          )}
        </div>
        <div style={{ height: '100%', minHeight: 0, overflow: 'hidden' }}>
          <NDataTable
            maxHeight="100%"
            columns={columns.value}
            data={props.data}
            {...(tableProps.value as Partial<DataTableProps>)}
          ></NDataTable>
        </div>
      </div>
    )
  },
})
