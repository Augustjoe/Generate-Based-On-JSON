import { RouterView } from 'vue-router'
import { CSSProperties, Transition, ref } from 'vue'
import Menu from '@/components/Menu'
import menuOptions from './menu'

export const indexComponent = defineComponent({
  name: 'Home',
  setup: () => {
    const layoutStyle: CSSProperties = {
      width: '100%',
      height: '100%',
    }
    const layoutContentStyle: CSSProperties = {
      height: '100%',
      padding: '24px',
    }
    const layoutHeaderStyle: CSSProperties = {
      height: '60px',
    }
    const collapsed = ref(false)
    const MenuProps = reactive({
      collapsed: collapsed,
      collapsedWidth: 65,
      collapsedIconSize: 22,
    })

    return {
      layoutStyle,
      layoutContentStyle,
      layoutHeaderStyle,
      collapsed,
      MenuProps,
      Collapse: () => {
        collapsed.value = true
      },
      Expand: () => {
        collapsed.value = false
      },
    }
  },
  render() {
    const {
      layoutStyle,
      layoutContentStyle,
      layoutHeaderStyle,
      collapsed,
      Collapse,
      Expand,
      MenuProps,
    } = this
    return (
      <n-layout style={layoutStyle} has-sider>
        <n-layout-sider
          bordered
          collapseMode="width"
          collapsedWidth={65}
          width={200}
          collapsed={collapsed}
          show-trigger
          onCollapse={Collapse}
          onExpand={Expand}
        >
          <div
            style={{
              height: '60px',
            }}
          >
            数据菜单平台
          </div>
          <Menu
            style={{
              height: 'calc(100% - 60px)',
            }}
            options={menuOptions}
            MenuProps={MenuProps}
          ></Menu>
        </n-layout-sider>
        <n-layout>
          <n-layout-header content-style={layoutHeaderStyle}>
            <n-space> MenuFoldOutlined MenuUnfoldOutlined</n-space>
          </n-layout-header>
          <n-layout-content content-style={layoutContentStyle}>
            <Transition>
              <RouterView />
            </Transition>
          </n-layout-content>
        </n-layout>
      </n-layout>
    )
  },
})
