import { defineComponent, ref, computed } from 'vue'
import { NButton, NBreadcrumb, NDropdown, DropdownOption } from 'naive-ui'
import { MenuFoldOutlined, MenuUnfoldOutlined, FullscreenOutlined } from '@vicons/antd'
import { LogoGithub, Refresh } from '@vicons/ionicons5'
import { enterFullScreen } from '@/assets/tool'
import { useRouter, useRoute } from 'vue-router'
import { Settings28Regular } from '@vicons/fluent'

import SearchInput from '@/components/SearchInput'
import TooltipButton from '@/components/TooltipButton'
import UserAvatar from './UserAvatar'
import SettingsDrawer from './SettingsDrawer'
import { useAppSettingsStore } from '@/stores/appSettings'

export const LeftHeaderComponent = defineComponent({
  name: 'HeaderComponent',
  props: {
    collapsed: {
      type: Boolean,
      required: true,
      default: false,
    },
    onToggleCollapsed: {
      type: Function,
      required: true,
      default: () => {},
    },
    onRefreshRoute: {
      type: Function,
      required: true,
      default: () => {},
    },
  },
  setup(props) {
    const collapsed = ref(props.collapsed)
    const settingsOpen = ref(false)
    const appSettings = useAppSettingsStore()
    const menuOptions: DropdownOption[] = [
      {
        label: '主控台',
        key: 'home',
      },
      {
        label: '工作台',
        key: 'workbench',
      },
    ]
    const router = useRouter()
    const route = useRoute()

    const nowSelectMenu = computed(() => {
      return route.name
    })

    const toggleCollapse = () => {
      collapsed.value = !collapsed.value
      props.onToggleCollapsed(collapsed.value)
    }

    const dropdownSelectChange = (key: string) => {
      const targetPath = key.startsWith('/') ? key : `/${key}`
      router.push({ path: targetPath })
    }

    return () => (
      <>
        <div
          style={{
            width: '100%',
            height: '60px',
            padding: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'transparent',
          }}
        >
          <div class="left-header-buttons" style={{ display: 'flex', alignItems: 'center' }}>
            {appSettings.menuPosition !== 'top' && (
              <>
                {/* 缩放按钮 */}
                <NButton class="item-button" text onClick={toggleCollapse}>
                  {{
                    icon: () => (collapsed.value ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />),
                  }}
                </NButton>
                {/* 刷新按钮 */}
                <NButton
                  class="item-button"
                  text
                  onClick={() => {
                    props.onRefreshRoute() // 调用传递过来的 onToggleCollapsed
                  }}
                  style={{ marginLeft: '10px' }}
                >
                  {{
                    icon: () => <Refresh />,
                  }}
                </NButton>
                {/* 菜单题头 */}
                <NBreadcrumb class="item-button" style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
                  <n-breadcrumb-item>
                    <NDropdown options={menuOptions} onSelect={dropdownSelectChange}>
                      <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', height: '100%' }}>控制面板</div>
                    </NDropdown>
                  </n-breadcrumb-item>
                  <n-breadcrumb-item>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>{nowSelectMenu.value}</div>
                  </n-breadcrumb-item>
                </NBreadcrumb>
              </>
            )}
          </div>

          <div class="right-header-buttons">
            <SearchInput />

            <TooltipButton
              tooltipProps={{}}
              buttonProps={{
                icon: <LogoGithub />,
                onClick: () => {
                  window.open('https://www.github.com', '_blank')
                },
                style: { marginLeft: '10px' },
                class: 'item-button',
              }}
            >
              Github
            </TooltipButton>

            <TooltipButton
              tooltipProps={{}}
              buttonProps={{
                icon: <FullscreenOutlined />,
                onClick: () => {
                  enterFullScreen(document.documentElement)
                },
                class: 'item-button',
              }}
            >
              全屏
            </TooltipButton>

            <UserAvatar></UserAvatar>

            <TooltipButton
              tooltipProps={{}}
              buttonProps={{
                icon: <Settings28Regular />,
                onClick: () => {
                  settingsOpen.value = true
                },
                class: 'item-button',
              }}
            >
              设置
            </TooltipButton>
          </div>
        </div>
        <SettingsDrawer show={settingsOpen.value} onUpdate:show={(val: boolean) => { settingsOpen.value = val }} />
      </>
    )
  },
})

export default LeftHeaderComponent


