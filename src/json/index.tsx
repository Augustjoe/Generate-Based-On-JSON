import { RouterView } from 'vue-router'
import { CSSProperties, Transition, DefineComponent, ref, h, onMounted } from 'vue'
import Menu from '@/components/Menu'
import menuOptions from './menu'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@vicons/antd'
import { NButton, NSpace } from 'naive-ui'
import iconImg from '@/assets/img/icon.png'
import { useLoadingBar } from 'naive-ui'

export const indexComponent = defineComponent({
  name: 'Home',
  setup: () => {
    const LoadingBar = useLoadingBar()
    LoadingBar.start()
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

    onMounted(() => {
      LoadingBar.finish()
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
            <NSpace
              style={{
                height: '60px',
              }}
              align="center"
              justify="center"
            >
              <img style={{ width: '40px' }} src={iconImg} alt="" />
              {!collapsed && <span>数据生成平台</span>}
            </NSpace>
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
          <n-layout-header style={layoutHeaderStyle}>
            <NSpace style={{ height: '100%', marginLeft: '10px' }} align="center" justify="start">
              {/* 缩放按钮 */}
              <NButton
                text
                onClick={() => {
                  this.collapsed = !this.collapsed
                }}
              >
                {{
                  icon: () => (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />),
                }}
              </NButton>
            </NSpace>
          </n-layout-header>
          <n-layout-content content-style={layoutContentStyle}>
            <routerView
              v-slots={{
                default: ({ Component }: { Component: DefineComponent }) => (
                  <Transition>{h(Component)}</Transition>
                ),
              }}
            />
          </n-layout-content>
        </n-layout>
      </n-layout>
    )
  },
})
