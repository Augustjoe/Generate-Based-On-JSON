import { defineComponent, nextTick, toRef } from 'vue'
import { NDrawer, NDrawerContent, NSpace, NSwitch, NDivider, NRadioGroup, NRadioButton, NButton, NText } from 'naive-ui'
import { useAppSettingsStore, MenuPosition, AppTheme } from '@/stores/appSettings'
import { useEditableRegistryStore } from '@/stores/editableRegistryStore'
import { openEditablePanelForPath } from '@/composables/useEditableRegistry'

export default defineComponent({
  name: 'SettingsDrawer',
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    'onUpdate:show': {
      type: Function as unknown as () => (val: boolean) => void,
      required: true,
    },
  },
  setup(props, { emit }) {
    const show = toRef(props, 'show')
    const appSettings = useAppSettingsStore()
    const editableRegistry = useEditableRegistryStore()

    const handleUpdateShow = (val: boolean) => {
      props['onUpdate:show'](val)
    }

    const changeMenuPosition = (val: string) => {
      appSettings.setMenuPosition(val as MenuPosition)
    }

    const changeTheme = (val: boolean) => {
      appSettings.setTheme(val ? 'dark' : 'light')
    }

    const changeEditMode = (val: boolean) => {
      appSettings.setEditMode(val)
    }

    return () => (
      <NDrawer show={show.value} onUpdateShow={handleUpdateShow} width={280} placement="right">
        <NDrawerContent title="系统配置" closable>
          <div style={{ padding: '8px 0px' }}>
            {/* 主题设置 */}
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>系统主题</h3>
            <NSpace justify="space-between" align="center" style={{ width: '100%' }}>
              <span>深色主题</span>
              <span onClick={() => changeTheme(appSettings.theme !== 'dark')}>
                <NSwitch value={appSettings.theme === 'dark'} />
              </span>
            </NSpace>

            <NDivider style={{ margin: '20px 0' }} />

            {/* 模式设置 */}
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>运行模式</h3>
            <NSpace justify="space-between" align="center" style={{ width: '100%' }}>
              <span>编辑模式</span>
              <span onClick={() => changeEditMode(!appSettings.isEdit)}>
              <NSwitch
                value={appSettings.isEdit}
                v-slots={{
                  checked: () => '编辑',
                  unchecked: () => '预览'
                }}
              />
              </span>
            </NSpace>
            {appSettings.isEdit && (
              <>
                {editableRegistry.sectionsByPath(window.location.pathname || '/').length > 0 ? (
                  <NButton
                    type="primary"
                    secondary
                    block
                    style={{ marginTop: '10px' }}
                    onClick={async () => {
                      props['onUpdate:show'](false)
                      await nextTick()
                      openEditablePanelForPath(window.location.pathname || '/', '页面配置面板')
                    }}
                  >
                    编辑当前页面
                  </NButton>
                ) : (
                  <NText depth={3} style={{ marginTop: '10px', display: 'block' }}>
                    当前页面暂无可编辑组件
                  </NText>
                )}
              </>
            )}

            <NDivider style={{ margin: '20px 0' }} />

            {/* 导航菜单位置 */}
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>导航菜单位置</h3>
            <NSpace vertical style={{ width: '100%' }}>
              <NRadioGroup
                value={appSettings.menuPosition}
                {...{ 'onUpdate:value': changeMenuPosition }}
                name="menuPosition"
                style={{ width: '100%' }}
              >
                <NSpace vertical style={{ width: '100%' }}>
                  <NRadioButton value="left" style={{ width: '100%', textAlign: 'center' }}>
                    左侧菜单布局
                  </NRadioButton>
                  <NRadioButton value="right" style={{ width: '100%', textAlign: 'center' }}>
                    右侧菜单布局
                  </NRadioButton>
                  <NRadioButton value="top" style={{ width: '100%', textAlign: 'center' }}>
                    顶部菜单布局
                  </NRadioButton>
                </NSpace>
              </NRadioGroup>
            </NSpace>

            <NDivider style={{ margin: '20px 0' }} />

            {/* 辅助提示 */}
            <div
              style={{
                background: 'rgba(24, 160, 88, 0.1)',
                border: '1px solid rgba(24, 160, 88, 0.2)',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '12px',
                color: '#18a058',
                lineHeight: 1.5
              }}
            >
              提示：开启“编辑模式”后，可在右侧 JSON 配置面板统一调整表单与表格模板结构，并支持在模板详情页导入/导出。
            </div>
          </div>
        </NDrawerContent>
      </NDrawer>
    )
  },
})
