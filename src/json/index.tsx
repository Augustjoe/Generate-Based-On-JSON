import { CSSProperties, Transition, DefineComponent, ref, h, onMounted } from 'vue'
import Menu from '@/components/Menu'
import menuOptions from './menu'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@vicons/antd'
import { DarkModeFilled, LightModeOutlined } from '@vicons/material'
import { NButton, NSpace } from 'naive-ui'
import iconImg from '@/assets/img/icon.png'
import { useLoadingBar, lightTheme, darkTheme } from 'naive-ui'

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
      <n-config-provider theme={lightTheme}>
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
              <div
                style={{
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  height: '60px',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <img style={{ width: '40px',marginRight:'10px' }} src={iconImg} alt="" />
                {!collapsed && <span>数据生成平台</span>}
              </div>
            </div>
            <Menu
              style={{
                height: 'calc(100% - 60px)',
                //  width: !collapsed ? "200px" : '65px'
              }}
              options={menuOptions}
              MenuProps={MenuProps}
            ></Menu>
          </n-layout-sider>
          <n-layout>
            <n-layout-header style={layoutHeaderStyle}>
              <NSpace style={{ height: '100%', marginLeft: '10px' }} align="center" justify="space-between">
                {/* 缩放按钮 */}
                <NSpace align="center" justify="start">
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
                <NSpace align="center" justify="start">
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
      </n-config-provider>
    )
  },
})
