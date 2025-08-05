import { defineComponent, reactive, VNode } from 'vue'
import {
  GithubOutlined,
  DashboardOutlined,
  ProfileOutlined,
  FileProtectOutlined,
  SettingOutlined,
  ApartmentOutlined,
  Html5Outlined,
} from '@vicons/antd'
import { LogoVue, LogoAngular, LogoReact, LogoJavascript } from '@vicons/ionicons5'

import './index.less'

export const Workbench = defineComponent({
  name: 'workbench',
  setup: () => {
    const projectArr: {
      icon: VNode
      title: string
      content: string
      footer: string
    }[] = [
      {
        icon: <GithubOutlined />,
        title: 'Github',
        content: '是一个面向开源及私有软件项目的托管平台。',
        footer: '日期：2025-01-01',
      },
      {
        icon: <LogoVue />,
        title: 'VUE',
        content: '渐进式 JavaScript 框架。',
        footer: '开学,2025-01-01',
      },
      {
        icon: <Html5Outlined />,
        title: 'Html5',
        content: 'HTML5是互联网的下一代标准。',
        footer: '撸码是艺术,2025-01-01',
      },
      {
        icon: <LogoAngular />,
        title: 'Angular',
        content: '现代 Web 开发平台，百万粉丝热捧。',
        footer: '不过我不会,2025-01-01',
      },
      {
        icon: <LogoReact />,
        title: 'React',
        content: '用于构建用户界面的 JavaScript 库.',
        footer: 'TSX好用,2025-01-01',
      },
      {
        icon: <LogoJavascript />,
        title: 'Js',
        content: '路是走出来的，而不是空想出来的。',
        footer: '现在都用TS,2025-01-01',
      },
    ]

    return () => (
      <div class="workbench">
        <n-card bordered={false} title="工作台" style={{ marginBottom: '10px' }}>
          <n-grid cols="1 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen">
            <n-gi>
              <div class={'workSpaceLeftTitile'}>
                <n-flex align="center">
                  <n-avatar
                    size={80}
                    round
                    src={new URL('@/assets/img/avatar_hello.png', import.meta.url).href}
                  />
                  <div class="detail">
                    <p>早安，哈基米，今天又是哈气的一天！</p>
                    <p class={'complement'}> 自你走后，有猫似你三分，我便慌了神。</p>
                  </div>
                </n-flex>
              </div>
            </n-gi>
            <n-gi>
              <n-flex
                class={'workSpaceRightTitile'}
                align="center"
                justify="end"
                style={{ height: '100%' }}
              >
                <n-statistic label="项目数" value="16" />
                <n-statistic label="待办" value="9 / 32" />
                <n-statistic label="消息" value="35" />
              </n-flex>
            </n-gi>
          </n-grid>
        </n-card>

        <n-grid cols="1 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen">
          <n-gi>
            <n-card bordered={false} title="项目" contentStyle={{ padding: 0 }}>
              <n-grid cols="3" responsive="screen">
                {projectArr.map((item) => {
                  const contentStyle = {
                    color: 'rgb(156 163 175)',
                    fontSize: '14px',
                  }

                  const forceTwoLines = {
                    width: '100%',
                    display: '-webkit-box',
                    height: '44px',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }
                  return (
                    <n-gi>
                      <n-card hoverable size="small">
                        <n-flex align="center">
                          <span>
                            <n-icon size="30">{item.icon}</n-icon>
                          </span>
                          <span style={{ marginLeft: '10px', fontSize: '18px' }}>{item.title}</span>
                        </n-flex>
                        <div style={{ ...contentStyle, ...forceTwoLines }}> {item.content} </div>
                        <div style={contentStyle}> {item.footer} </div>
                      </n-card>
                    </n-gi>
                  )
                })}
              </n-grid>
            </n-card>
          </n-gi>
          <n-gi></n-gi>
        </n-grid>
      </div>
    )
  },
})

export default Workbench
