import { CSSProperties, Transition, DefineComponent, ref, h, onMounted } from 'vue'
import Menu from '@/components/Menu'
import menuOptions from '../menu'
import iconImg from '@/assets/img/icon.png'
import { useLoadingBar, lightTheme, darkTheme } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { MenuOption, useMessage } from 'naive-ui'
import './less/index.less'

import UseDrawer from '@/components/useDrawer'
import { LeftHeaderComponent } from './components/hearderButtons'
import MenuTag from './components/MenuTag'

export const indexComponent = defineComponent({
  name: 'Home',
  setup: () => {
    const router = useRouter()
    const route = useRoute()
    const routerKey = ref(1)
    const LoadingBar = useLoadingBar()
    LoadingBar.start()
    const layoutStyle: CSSProperties = {
      width: '100%',
      height: '100%',
    }
    const layoutContentStyle: CSSProperties = {
      height: '100%',
      padding: '0px 0px 10px 10px',
      scrollbarGutter: 'stable',
      overflowX: 'hidden',
    }
    const layoutHeaderStyle: CSSProperties = {}
    const collapsed = ref(false)

    const routeKey = computed(() => {
      const menuOptionArr: MenuOption[] = []
      // 取出其中的所有子菜单项
      menuOptions.forEach((item) => {
        if (item.children) {
          item.children.forEach((child) => {
            menuOptionArr.push(child)
          })
        } else {
          menuOptionArr.push(item)
        }
      })

      return menuOptionArr.find(({ label }) => route.name === label)?.key || null
    })

    const MenuProps = reactive({
      collapsed: collapsed,
      collapsedWidth: 65,
      collapsedIconSize: 22,
      value: routeKey,
      'onUpdate:value': (path: string) => {
        router.push({ path })
      },
    })

    const refreshRoute = () => {
      routerKey.value += 1
    }

    onMounted(() => {
      window.$message = useMessage()
      LoadingBar.finish()
    })

    return {
      routerKey,
      layoutStyle,
      layoutContentStyle,
      layoutHeaderStyle,
      collapsed,
      MenuProps,
      refreshRoute,
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
      refreshRoute,
    } = this
    return (
      <n-config-provider style={{ height: '100%' }} theme={lightTheme}>
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '60px',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <img style={{ width: '40px', marginRight: '10px' }} src={iconImg} alt="" />
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
          <n-layout content-style={{ height: '100%' }} style={{ height: '100%' }}>
            <n-layout-header style={layoutHeaderStyle}>
              <LeftHeaderComponent
                collapsed={collapsed}
                onToggleCollapsed={() => {
                  this.collapsed = !this.collapsed
                }}
                onRefreshRoute={refreshRoute}
              ></LeftHeaderComponent>
            </n-layout-header>

            <div class="MenuTag">
              <MenuTag></MenuTag>
            </div>

            <n-layout-content
              style={{
                height: 'calc(100% - 98px)',
                background: '#f5f7f9',
              }}
              content-style={layoutContentStyle}
            >
              <routerView
                v-slots={{
                  default: ({ Component }: { Component: DefineComponent }) => (
                    <Transition mode="out-in">
                      {h(Component, { key: `routerKey` + this.routerKey })}
                    </Transition>
                  ),
                }}
              />
              <n-back-top right={30} />
            </n-layout-content>
          </n-layout>
        </n-layout>
        <UseDrawer />
      </n-config-provider>
    )
  },
})
