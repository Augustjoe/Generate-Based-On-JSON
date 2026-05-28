import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { NAlert, NButton, NCard, NEmpty, NFlex, NText } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import CardCodeEditor from '@/components/CardCodeEditor'
import Form from '@/components/Form'
import ProTable from '@/components/ProTable'
import { useTemplateStore } from '@/stores/templateStore'
import type { TemplateAsset } from '@/types/template'

const previewRows = [
  { id: 1, orderNo: 'ORD-001', customer: '上海青木贸易' },
  { id: 2, orderNo: 'ORD-002', customer: '杭州云舟科技' },
]

export default defineComponent({
  name: 'TemplateDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const templateStore = useTemplateStore()
    const templateJson = ref('')
    const formData = reactive<Record<string, any>>({})
    const fileInputRef = ref<HTMLInputElement | null>(null)

    onMounted(() => {
      templateStore.init()
    })

    const currentTemplate = computed(() => templateStore.getById(String(route.params.id || '')) as TemplateAsset | undefined)

    watch(
      currentTemplate,
      (val) => {
        templateJson.value = val ? JSON.stringify(val, null, 2) : ''
      },
      { immediate: true },
    )

    const applyJson = () => {
      if (!currentTemplate.value) return
      try {
        const parsed = JSON.parse(templateJson.value) as TemplateAsset
        if (!parsed.config || !parsed.type) {
          throw new Error('模板结构缺少 type/config 字段')
        }
        templateStore.importTemplateFromText(JSON.stringify(parsed))
        window.$message?.success('模板配置已更新')
      } catch (error: any) {
        window.$message?.error(error?.message || 'JSON 格式不正确')
      }
    }

    const exportJson = () => {
      if (!currentTemplate.value) return
      try {
        const text = templateStore.exportTemplateText(currentTemplate.value.id)
        const blob = new Blob([text], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${currentTemplate.value.id}.json`
        a.click()
        URL.revokeObjectURL(url)
      } catch (error: any) {
        window.$message?.error(error?.message || '导出失败')
      }
    }

    const importJson = async (event: Event) => {
      const input = event.target as HTMLInputElement
      const file = input.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const imported = templateStore.importTemplateFromText(text)
        window.$message?.success(`已导入模板：${imported.name}`)
      } catch (error: any) {
        window.$message?.error(error?.message || '导入失败，JSON 非法')
      } finally {
        input.value = ''
      }
    }

    return () => {
      if (!currentTemplate.value) {
        return (
          <div style={{ padding: '16px' }}>
            <NEmpty description="模板不存在或已被删除" />
          </div>
        )
      }

      const tpl = currentTemplate.value
      const isForm = tpl.type === 'form'

      return (
        <div class="template-page-shell">
          <NFlex justify="space-between" align="center" style={{ marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <NText depth={3}>ID: {tpl.id}</NText>
            <NButton
              quaternary
              type="primary"
              onClick={() => {
                router.push('/templateList')
              }}
            >
              返回模板列表
            </NButton>
          </NFlex>
          <NAlert type="info" style={{ marginBottom: '10px' }}>
            当前页面仅编辑模板结构配置，不会改动运行时业务数据。
          </NAlert>
          <div class="template-detail-grid">
          <NCard
            title={`${tpl.name} - 配置`}
            style={{ height: '100%' }}
            contentStyle={{ height: 'calc(100% - 48px)', display: 'flex', flexDirection: 'column' }}
          >
            <NFlex style={{ marginBottom: '10px' }} wrap>
              <NButton type="primary" onClick={applyJson}>
                应用 JSON
              </NButton>
              <NButton onClick={exportJson}>导出 JSON</NButton>
              <NButton
                onClick={() => {
                  fileInputRef.value?.click()
                }}
              >
                导入 JSON
              </NButton>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                style={{ display: 'none' }}
                onChange={importJson}
              />
            </NFlex>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CardCodeEditor codeValue={templateJson.value} onUpdate:codeValue={(val: string) => (templateJson.value = val)} />
            </div>
          </NCard>
          <NCard title="模板预览" style={{ height: '100%' }} contentStyle={{ height: 'calc(100% - 48px)' }}>
            {isForm ? (
              <Form
                formData={formData}
                formItems={(tpl.config as any).formItems || []}
                formProps={(tpl.config as any).formProps || {}}
              />
            ) : (
              <ProTable
                formItems={(tpl.config as any).formItems || []}
                formProps={(tpl.config as any).formProps || {}}
                formButtonItems={(tpl.config as any).formButtonItems || []}
                columns={(tpl.config as any).columns || []}
                tableButtons={(tpl.config as any).tableButtons || []}
                tableProps={(tpl.config as any).tableProps || {}}
                data={previewRows}
              />
            )}
          </NCard>
          </div>
        </div>
      )
    }
  },
})
