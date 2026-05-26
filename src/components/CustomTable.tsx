import {
  computed,
  defineAsyncComponent,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type VNode,
} from 'vue'
import {
  NButton,
  NCheckbox,
  NDataTable,
  NFlex,
  NIcon,
  NScrollbar,
  NTooltip,
  type DataTableColumns,
  type DataTableProps,
} from 'naive-ui'
import {
  ColumnTripleEdit24Regular,
  Drag24Regular,
  EditSettings24Regular,
  Settings32Regular,
  TableSettings24Regular,
} from '@vicons/fluent'
import Draggable from 'vuedraggable'
import Sortable from 'sortablejs'
import { extractRenderFns, restoreRenderFns } from '@/assets/render-fn-extractor'
import { renderIconFromString } from '@/utils/iconMap'

const FormEditorButton = defineAsyncComponent(() => import('./FormEditorButton'))
const DraggableComponent = Draggable as any

type ColumnKey = string | number
type TableColumn = DataTableColumns<Record<string, any>>[number] & Record<string, any>

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
  emits: ['update:tableButtons', 'update:columns', 'update:tableProps', 'action'],
  setup(props, { emit }) {
    const tableRootRef = ref<HTMLElement | null>(null)
    const columns = ref<TableColumn[]>((props.columns || []) as TableColumn[])
    const tableProps = ref<Partial<DataTableProps>>(props.tableProps || {})
    const editTableButtons = ref<tableButtonItem>([])
    const hiddenColumnKeys = ref<ColumnKey[]>([])
    const showColumnSettings = ref(false)
    const headerSortable = shallowRef<any>(null)
    let tempRender: Record<string, () => HTMLElement | VNode> = {}

    const getColumnKey = (column: TableColumn) => column.key ?? column.type

    const getColumnTitleText = (column: TableColumn) => {
      const rawTitle = column.__rawTitle ?? column.title
      if (typeof rawTitle === 'string') return rawTitle
      return String(getColumnKey(column) ?? '未命名列')
    }

    const syncColumns = (nextColumns: TableColumn[]) => {
      columns.value = nextColumns
      emit('update:columns', columns.value as DataTableColumns<Record<string, any>>)
    }

    const toggleColumnVisible = (columnKey: ColumnKey, checked: boolean) => {
      if (!checked && columns.value.length - hiddenColumnKeys.value.length <= 1) {
        window.$message?.warning('至少保留一列展示')
        return
      }

      hiddenColumnKeys.value = checked
        ? hiddenColumnKeys.value.filter((key) => key !== columnKey)
        : Array.from(new Set([...hiddenColumnKeys.value, columnKey]))
    }

    const visibleColumns = computed(() =>
      columns.value.filter((column) => {
        const columnKey = getColumnKey(column)
        return columnKey === undefined || !hiddenColumnKeys.value.includes(columnKey)
      }),
    )

    const moveVisibleColumn = (oldIndex: number, newIndex: number) => {
      if (oldIndex === newIndex || oldIndex < 0 || newIndex < 0) return

      const visibleKeys = visibleColumns.value.map(getColumnKey)
      const sourceKey = visibleKeys[oldIndex]
      const targetKey = visibleKeys[newIndex]
      if (sourceKey === undefined || targetKey === undefined || sourceKey === targetKey) return

      const nextColumns = [...columns.value]
      const sourceIndex = nextColumns.findIndex((column) => getColumnKey(column) === sourceKey)
      const targetIndex = nextColumns.findIndex((column) => getColumnKey(column) === targetKey)
      if (sourceIndex < 0 || targetIndex < 0) return

      const [sourceColumn] = nextColumns.splice(sourceIndex, 1)
      nextColumns.splice(targetIndex, 0, sourceColumn)
      syncColumns(nextColumns)
    }

    const renderColumnTitle = (column: TableColumn) => {
      const rawTitle = column.__rawTitle ?? column.title
      const titleContent = typeof rawTitle === 'function' ? rawTitle(column) : rawTitle
      const columnKey = getColumnKey(column)

      if (!props.isEdit || columnKey === undefined) {
        return titleContent
      }

      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            minWidth: 0,
          }}
        >
          <span
            class="column-drag-handle"
            data-column-drag-handle="true"
            title="拖拽调整列顺序"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'grab',
              color: 'var(--n-th-icon-color)',
              lineHeight: 1,
            }}
          >
            <NIcon size={16} component={Drag24Regular}></NIcon>
          </span>
          <span>{titleContent}</span>
        </span>
      )
    }

    const displayColumns = computed(() =>
      visibleColumns.value.map((column) => ({
        ...column,
        __rawTitle: column.__rawTitle ?? column.title,
        title: renderColumnTitle({ ...column, __rawTitle: column.__rawTitle ?? column.title }) as any,
      })),
    )

    const initHeaderSortable = async () => {
      await nextTick()
      headerSortable.value?.destroy()
      headerSortable.value = null

      if (!props.isEdit || !tableRootRef.value) return

      const headerRow = tableRootRef.value.querySelector(
        '.n-data-table-base-table-header thead tr, .n-data-table-thead tr, thead tr',
      ) as HTMLElement | null
      if (!headerRow) return

      headerSortable.value = Sortable.create(headerRow, {
        animation: 180,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        handle: '.column-drag-handle',
        draggable: 'th',
        ghostClass: 'column-sortable-ghost',
        chosenClass: 'column-sortable-chosen',
        dragClass: 'column-sortable-drag',
        onEnd: ({ oldIndex, newIndex }: { oldIndex?: number; newIndex?: number }) => {
          if (oldIndex === undefined || newIndex === undefined) return
          moveVisibleColumn(oldIndex, newIndex)
        },
      })
    }

    const destroyHeaderSortable = () => {
      headerSortable.value?.destroy()
      headerSortable.value = null
    }

    const renderColumnSettings = () => (
      <div style={{ width: '260px' }}>
        <div style={{ fontWeight: 600, marginBottom: '10px' }}>列设置</div>
        <NScrollbar style={{ maxHeight: '320px' }}>
          <DraggableComponent
            modelValue={columns.value}
            itemKey={(column: TableColumn) => String(getColumnKey(column))}
            handle=".column-setting-drag-handle"
            animation={180}
            ghostClass="column-setting-ghost"
            chosenClass="column-setting-chosen"
            dragClass="column-setting-drag"
            {...{
              'onUpdate:modelValue': (items: TableColumn[]) => syncColumns(items),
            }}
            v-slots={{
              item: ({ element: column }: { element: TableColumn }) => {
                const columnKey = getColumnKey(column)
                if (columnKey === undefined) return null
                return (
                  <div
                    key={String(columnKey)}
                    class="column-setting-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid var(--n-border-color)',
                    }}
                  >
                    <span
                      class="column-setting-drag-handle"
                      data-column-setting-drag-handle="true"
                      title="拖拽调整列顺序"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        cursor: 'grab',
                        color: 'var(--n-text-color-3)',
                      }}
                    >
                      <NIcon size={16} component={Drag24Regular}></NIcon>
                    </span>
                    <NCheckbox
                      checked={!hiddenColumnKeys.value.includes(columnKey)}
                      onUpdate:checked={(checked: boolean) => toggleColumnVisible(columnKey, checked)}
                    >
                      {getColumnTitleText(column)}
                    </NCheckbox>
                  </div>
                )
              },
            }}
          />
        </NScrollbar>
      </div>
    )

    const getTempRenderMap = () => {
      const { data, slots } = extractRenderFns(props.tableButtons || [])
      editTableButtons.value = data
      tempRender = slots
    }

    watch(
      () => props.columns,
      (newVal) => {
        columns.value = ((newVal || []) as TableColumn[]).map((column) => ({
          ...column,
          __rawTitle: (column as TableColumn).__rawTitle ?? column.title,
        }))
        hiddenColumnKeys.value = hiddenColumnKeys.value.filter((key) =>
          columns.value.some((column) => getColumnKey(column) === key),
        )
      },
      { immediate: true },
    )

    watch(
      () => props.tableProps,
      (newVal) => {
        tableProps.value = newVal || {}
      },
      { immediate: true },
    )

    watch(() => props.tableButtons, getTempRenderMap)
    watch(() => [props.isEdit, displayColumns.value.map(getColumnKey).join('|')], initHeaderSortable, {
      flush: 'post',
    })

    onMounted(() => {
      getTempRenderMap()
      initHeaderSortable()
    })

    onBeforeUnmount(destroyHeaderSortable)

    return () => (
      <div
        ref={tableRootRef}
        style={{
          height: '100%',
          padding: '10px',
          display: 'grid',
          position: 'relative',
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
            {props.tableButtons.map((item) => {
              if (item.type === 'custom' && item.render) {
                return item.render()
              } else if (item.type !== 'custom') {
                const { icon, actionType, onClick, ...btnProps } = item
                const finalRenderIcon = icon ? renderIconFromString(icon) : btnProps.renderIcon
                const handleClick = (e: MouseEvent) => {
                  if (onClick) {
                    if (Array.isArray(onClick)) {
                      onClick.forEach((fn: any) => fn(e))
                    } else {
                      ;(onClick as any)(e)
                    }
                  }
                  if (actionType) {
                    emit('action', actionType, null)
                  }
                }
                return (
                  <NButton {...btnProps} renderIcon={finalRenderIcon} onClick={handleClick}>
                    {item.buttonText}
                  </NButton>
                )
              }
            })}
            {props.isEdit && (
              <FormEditorButton
                style={{}}
                formItems={editTableButtons.value}
                buttonProps={{
                  renderIcon: () => <NIcon component={<EditSettings24Regular />}></NIcon>,
                  type: 'info',
                }}
                onUpdate:formItems={(items: tableButtonItem) => {
                  emit('update:tableButtons', restoreRenderFns(items, tempRender))
                }}
                propoverTitle="表格按钮配置"
              ></FormEditorButton>
            )}
          </NFlex>

          {props.isEdit && (
            <NFlex align="center">
              <NTooltip trigger="hover" placement="bottom">
                {{
                  trigger: () => (
                    <NButton
                      circle
                      type="info"
                      renderIcon={() => <NIcon component={ColumnTripleEdit24Regular}></NIcon>}
                      onClick={() => {
                        showColumnSettings.value = !showColumnSettings.value
                      }}
                    />
                  ),
                  default: () => '列显示与排序',
                }}
              </NTooltip>
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
                  syncColumns(items as TableColumn[])
                }}
                propoverTitle="列配置"
              ></FormEditorButton>
            </NFlex>
          )}
        </div>
        {props.isEdit && showColumnSettings.value && (
          <div
            style={{
              position: 'absolute',
              top: '52px',
              right: '10px',
              zIndex: 10,
              padding: '12px',
              background: 'var(--n-color)',
              border: '1px solid var(--n-border-color)',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            }}
          >
            {renderColumnSettings()}
          </div>
        )}
        <div style={{ height: '100%', minHeight: 0, overflow: 'auto' }}>
          <NDataTable
            style={{ height: '100%' }}
            flexHeight
            columns={displayColumns.value as DataTableColumns<Record<string, any>>}
            data={props.data}
            {...(tableProps.value as Partial<DataTableProps>)}
          ></NDataTable>
        </div>
      </div>
    )
  },
})
