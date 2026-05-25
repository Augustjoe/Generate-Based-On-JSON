import { CSSProperties, Transition, DefineComponent, ref, h, onMounted, computed, reactive, defineComponent } from 'vue'
import Menu from '@/components/Menu'
import menuOptions from '../menu'
import iconImg from '@/assets/img/icon.png'
import { useLoadingBar, lightTheme, darkTheme } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { MenuOption, useMessage, NDropdown, NBreadcrumb, NBreadcrumbItem } from 'naive-ui'
import './less/index.less'

import UseDrawer from '@/components/useDrawer'
import { LeftHeaderComponent } from './components/hearderButtons'
import MenuTag from './components/MenuTag'
import { useAppSettingsStore } from '@/stores/appSettings'

export const indexComponent = defineComponent({
  name: 'Home',
  setup: () => {
    const router = useRouter()
    const route = useRoute()
    const routerKey = ref(1)
    const LoadingBar = useLoadingBar()
    const appSettings = useAppSettingsStore()
    
    if (LoadingBar) {
      LoadingBar.start()
    }
    const layoutStyle: CSSProperties = {
      width: '100%',
      height: '100%',
    }
    const layoutContentStyle: CSSProperties = {
      height: '100%',
      padding: '0px 0px 10px 10px',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'relative',
    }
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

    const refreshRoute = () => {
      routerKey.value += 1
    }

    const handleMenuClick = (key: string) => {
      const targetPath = key.startsWith('/') ? key : `/${key}`
      router.push({ path: targetPath })
    }

    onMounted(() => {
      window.$message = useMessage()
      if (LoadingBar) {
        LoadingBar.finish()
      }
    })

    return {
      appSettings,
      router,
      route,
      routerKey,
      routeKey,
      handleMenuClick,
      refreshRoute,
      layoutStyle,
      layoutContentStyle,
      collapsed,
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
      appSettings,
      router,
      route,
      layoutStyle,
      layoutContentStyle,
      collapsed,
      Collapse,
      Expand,
      routeKey,
      handleMenuClick,
      refreshRoute,
    } = this

    const currentTheme = appSettings.theme === 'dark' ? darkTheme : lightTheme

    const renderSider = () => (
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
          }}
          options={menuOptions}
          MenuProps={{
            collapsed: collapsed,
            collapsedWidth: 65,
            collapsedIconSize: 22,
            value: routeKey,
            onUpdateValue: handleMenuClick
          }}
        ></Menu>
      </n-layout-sider>
    )

    const renderMainContent = () => (
      <n-layout content-style={{ height: '100%' }} style={{ height: '100%' }}>
        <n-layout-header>
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
            height: 'calc(100% - 104px)',
            background: appSettings.theme === 'dark' ? '#18181c' : '#f5f7f9',
            overflow: 'hidden',
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
    )

    // 顶部菜单模式的布局
    const topMenuOptions = [
      { label: '主控台', key: 'home' },
      { label: '工作台', key: 'workbench' },
    ]
    const renderTopLayout = () => (
      <n-layout class={appSettings.theme === 'dark' ? 'theme-dark' : ''} style={layoutStyle}>
        <n-layout-header>
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img style={{ width: '32px', marginRight: '8px' }} src={iconImg} alt="" />
            <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '24px' }}>数据生成平台</span>
            
            {/* 顶部布局专属的面包屑，位于菜单之前 */}
            <NBreadcrumb style={{ marginRight: '24px', display: 'flex', alignItems: 'center' }}>
              <n-breadcrumb-item>
                <NDropdown options={topMenuOptions} onSelect={(key) => router.push({ path: key })}>
                  <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', height: '100%' }}>控制面板</div>
                </NDropdown>
              </n-breadcrumb-item>
              <n-breadcrumb-item>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>{route.name}</div>
              </n-breadcrumb-item>
            </NBreadcrumb>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <Menu
              options={menuOptions}
              MenuProps={{
                mode: 'horizontal',
                value: routeKey,
                onUpdateValue: handleMenuClick
              }}
            />
          </div>

          <div style={{ flexShrink: 0 }}>
            <LeftHeaderComponent
              collapsed={false}
              onToggleCollapsed={() => {}}
              onRefreshRoute={refreshRoute}
            />
          </div>
        </n-layout-header>

        <div class="MenuTag">
          <MenuTag></MenuTag>
        </div>

        <n-layout-content
          style={{
            height: 'calc(100% - 104px)',
            background: appSettings.theme === 'dark' ? '#18181c' : '#f5f7f9',
            overflow: 'hidden',
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
    )

    return (
      <n-config-provider style={{ height: '100%' }} theme={currentTheme}>
        {appSettings.menuPosition === 'top' ? (
          renderTopLayout()
        ) : (
          <n-layout class={appSettings.theme === 'dark' ? 'theme-dark' : ''} style={layoutStyle} has-sider>
            {appSettings.menuPosition === 'left' && renderSider()}
            {renderMainContent()}
            {appSettings.menuPosition === 'right' && renderSider()}
          </n-layout>
        )}
        <UseDrawer />
      </n-config-provider>
    )
  },
})

