import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from 'vue'
import {
  NButton,
  NDataTable,
  NFlex,
  NIcon,
  type DataTableColumns,
  type DataTableProps,
} from 'naive-ui'
import { Drag24Regular } from '@vicons/fluent'
// @ts-ignore sortablejs is untyped in this project baseline
import Sortable from 'sortablejs'
import { renderIconFromString } from '@/utils/iconMap'

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
    const headerSortable = shallowRef<any>(null)

    const getColumnKey = (column: TableColumn) => column.key ?? column.type

    const syncColumns = (nextColumns: TableColumn[]) => {
      columns.value = nextColumns
      emit('update:columns', columns.value as DataTableColumns<Record<string, any>>)
    }

    const visibleColumns = computed(() => columns.value)

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

    watch(
      () => props.columns,
      (newVal) => {
        columns.value = ((newVal || []) as TableColumn[]).map((column) => ({
          ...column,
          __rawTitle: (column as TableColumn).__rawTitle ?? column.title,
        }))
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

    watch(() => [props.isEdit, displayColumns.value.map(getColumnKey).join('|')], initHeaderSortable, {
      flush: 'post',
    })

    onMounted(() => {
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
          </NFlex>
        </div>
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
