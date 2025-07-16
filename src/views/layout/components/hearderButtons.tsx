import { defineComponent, ref } from 'vue'
import { NButton, NBreadcrumb, NDropdown, DropdownOption } from 'naive-ui'
import { MenuFoldOutlined, MenuUnfoldOutlined, FullscreenOutlined } from '@vicons/antd'
import { LogoGithub, Refresh } from '@vicons/ionicons5'
import { enterFullScreen } from '@/assets/tool'
import { useRouter, useRoute } from 'vue-router'
import SearchInput from '@/components/searchinput'
import TooltipButton from '@/components/TooltipButton'

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
      console.log(route, 'route')
      return route.name
    })

    const toggleCollapse = () => {
      collapsed.value = !collapsed.value
      props.onToggleCollapsed(collapsed.value)
    }

    const dropdownSelectChange = (key: string) => {
      router.push({ path: key })
    }

    return () => (
      <div
        style={{
          height: '60px',
          padding: '0px 10px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: `0 1px 4px rgba(0, 21, 41, 0.08)`,
          justifyContent: 'space-between',
        }}
      >
        <div class="left-header-buttons">
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
          >
            {{
              icon: () => <Refresh />,
            }}
          </NButton>
          {/* 菜单题头 */}
          <NBreadcrumb class="item-button">
            <n-breadcrumb-item>
              <NDropdown options={menuOptions} onSelect={dropdownSelectChange}>
                <div>控制面板</div>
              </NDropdown>
            </n-breadcrumb-item>
            <n-breadcrumb-item>{nowSelectMenu.value}</n-breadcrumb-item>
          </NBreadcrumb>
        </div>

        <div class="right-header-buttons">
          {/* <span class="item-button"> */}
          <SearchInput />
          {/* </span> */}

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
        </div>
      </div>
    )
  },
})

export default LeftHeaderComponent
