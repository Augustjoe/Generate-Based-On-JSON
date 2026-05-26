import { defineComponent, toRef } from 'vue'
import { NDrawer, NDrawerContent, NSpace, NSwitch, NDivider, NRadioGroup, NRadioButton, NTooltip } from 'naive-ui'
import { useAppSettingsStore, MenuPosition, AppTheme } from '@/stores/appSettings'

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
              提示：您可以点击“编辑模式”直接在界面中调整表格列、搜索表单项和操作按钮。调整后的配置可以导出！
            </div>
          </div>
        </NDrawerContent>
      </NDrawer>
    )
  },
})
