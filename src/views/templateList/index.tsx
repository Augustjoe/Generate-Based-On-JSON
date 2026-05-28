import { computed, defineComponent, onMounted } from 'vue'
import { NButton, NCard, NEmpty, NFlex, NTag, type DataTableColumns } from 'naive-ui'
import ProTable from '@/components/ProTable'
import { useRouter } from 'vue-router'
import { useTemplateStore } from '@/stores/templateStore'

export default defineComponent({
  name: 'TemplateListView',
  setup() {
    const router = useRouter()
    const templateStore = useTemplateStore()

    onMounted(() => {
      templateStore.init()
    })

    const columns = computed<DataTableColumns<Record<string, any>>>(() => [
      { title: '模板名称', key: 'name', minWidth: 200 },
      {
        title: '类型',
        key: 'type',
        width: 120,
        render: (row: Record<string, any>) => (
          <NTag type={row.type === 'form' ? 'info' : 'success'}>
            {row.type === 'form' ? '表单模板' : '表格模板'}
          </NTag>
        ),
      },
      { title: '更新时间', key: 'updatedAt', width: 140 },
      { title: '描述', key: 'description', minWidth: 220 },
      {
        title: '操作',
        key: 'actions',
        width: 120,
        render: (row: Record<string, any>) => (
          <NButton
            text
            type="primary"
            onClick={() => {
              router.push(`/templateDetail/${String(row.id)}`)
            }}
          >
            查看详情
          </NButton>
        ),
      },
    ])

    const rows = computed(() => templateStore.templates)

    return () => (
      <div class="template-page-shell">
        <NCard
          title="模板列表"
          style={{ height: '100%' }}
          contentStyle={{ height: 'calc(100% - 48px)', display: 'flex', flexDirection: 'column' }}
        >
          <div class="template-page-subtitle">管理可复用的低代码模板资产，支持查看、编辑、导入和导出。</div>
          {rows.value.length === 0 ? (
            <NEmpty description="暂无模板数据，请先导入模板 JSON 或使用默认 mock 模板。" />
          ) : (
            <NFlex vertical style={{ height: '100%', minHeight: 0 }}>
              <ProTable columns={columns.value} data={rows.value} tableProps={{ rowKey: (row: any) => row.id }} />
            </NFlex>
          )}
        </NCard>
      </div>
    )
  },
})
