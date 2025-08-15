import { defineComponent, reactive, VNode } from 'vue'
import {
  GithubOutlined,
  DashboardOutlined,
  ProfileOutlined,
  FileProtectOutlined,
  SettingOutlined,
  ApartmentOutlined,
  Html5Outlined,
  UserOutlined,
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
      color: string
    }[] = [
      {
        icon: <GithubOutlined />,
        title: 'Github',
        content: '是一个面向开源及私有软件项目的托管平台。',
        footer: '日期：2025-01-01',
        color: '#181717',
      },
      {
        icon: <LogoVue />,
        title: 'VUE',
        content: '渐进式 JavaScript 框架。',
        footer: '开学,2025-01-01',
        color: '#42b883',
      },
      {
        icon: <Html5Outlined />,
        title: 'Html5',
        content: 'HTML5是互联网的下一代标准。',
        footer: '撸码是艺术,2025-01-01',
        color: '#e34c26',
      },
      {
        icon: <LogoAngular />,
        title: 'Angular',
        content: '现代 Web 开发平台，百万粉丝热捧。',
        footer: '不过我不会,2025-01-01',
        color: '#dd0031',
      },
      {
        icon: <LogoReact />,
        title: 'React',
        content: '用于构建用户界面的 JavaScript 库.',
        footer: 'TSX好用,2025-01-01',
        color: '#61dafb',
      },
      {
        icon: <LogoJavascript />,
        title: 'Js',
        content: '路是走出来的，而不是空想出来的。',
        footer: '现在都用TS,2025-01-01',
        color: '#f7df1e',
      },
    ]

    const shortcutArr: {
      icon: VNode
      title: string
      color: string
    }[] = [
      {
        icon: <DashboardOutlined />,
        title: '主控台',
        color: '#68c755',
      },
      {
        icon: <ProfileOutlined />,
        title: '列表',
        color: '#fab251',
      },
      {
        icon: <FileProtectOutlined />,
        title: '表单',
        color: '#1890ff',
      },
      {
        icon: <ApartmentOutlined />,
        title: '权限管理',
        color: '#f06b96',
      },
      {
        icon: <SettingOutlined />,
        title: '系统管理',
        color: '#7238d1',
      },
      {
        icon: <UserOutlined />,
        title: '用户管理',
        color: '#17a2b8',
      },
    ]

    const dynamicList: {
      avatar: string
      content: string
      time: string
    }[] = [
      {
        avatar: new URL('@/assets/img/smile_cat.png', import.meta.url).href,
        content: '狗哥下次再来一起玩，别管那些神经病！',
        time: '2025.08.14 15:09:01',
      },
      {
        avatar: new URL('@/assets/img/dog_happy.png', import.meta.url).href,
        content: '猫猫是我们最好的朋友！！和猫猫玩最开心了！',
        time: '2025.08.14 15:00:01',
      },

      {
        avatar: new URL('@/assets/img/beautiful_dog.png', import.meta.url).href,
        content: '哇，猫哥好可怕，不像我，只会心疼哥哥！',
        time: '2025.08.14 14:51:01',
      },
      {
        avatar: new URL('@/assets/img/dog_smile.png', import.meta.url).href,
        content: '猫哥，伸手不打笑脸狗！',
        time: '2025.08.14 14:02:01',
      },
      {
        avatar: new URL('@/assets/img/shikimi.png', import.meta.url).href,
        content: '嗨，希基米！！',
        time: '2025.08.14 12:04:01',
      },
      {
        avatar: new URL('@/assets/img/General_cat.png', import.meta.url).href,
        content: '猫猫必将统治世界，现在只是为了罐头，暂时的妥协，',
        time: '2025.08.14 11:44:01',
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

        <n-grid cols="1 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen" x-gap="10" y-gap="10">
          <n-gi>
            <n-card
              bordered={false}
              title="项目"
              style={{ marginBottom: '10px' }}
              contentStyle={{ padding: 0 }}
            >
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
                    WebkitBoxOrient: 'vertical' as any,
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }
                  return (
                    <n-gi>
                      <n-card hoverable size="small">
                        <n-flex align="center">
                          <span>
                            <n-icon color={item.color} size="30">
                              {item.icon}
                            </n-icon>
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

            <n-card bordered={false} title="动态" contentStyle={{ padding: 12 }}>
              <n-list>
                {dynamicList.map((item) => {
                  return (
                    <n-list-item
                      style={{
                        borderBottom: '1px solid rgb(229, 231, 235)',
                      }}
                    >
                      {{
                        prefix: () => <n-avatar size={48} round src={item.avatar} />,
                        default: () => (
                          <div>
                            <p
                              style={{
                                fontSize: '16px',
                                marginBottom: '4px',
                              }}
                            >
                              {item.content}
                            </p>
                            <p
                              style={{
                                fontSize: '12px',
                                color: 'rgb(156, 163, 175)',
                              }}
                            >
                              {item.time}
                            </p>
                          </div>
                        ),
                      }}
                    </n-list-item>
                  )
                })}
              </n-list>
            </n-card>
          </n-gi>
          <n-gi>
            <n-card
              bordered={false}
              title="快捷操作"
              style={{ marginBottom: '10px' }}
              contentStyle={{ padding: 0 }}
            >
              <n-grid cols="3" responsive="screen">
                {shortcutArr.map((item) => {
                  return (
                    <n-gi>
                      <n-card hoverable size="small">
                        <n-flex align="center" justify="center">
                          <n-icon color={item.color} size="30">
                            {item.icon}
                          </n-icon>
                        </n-flex>
                        <n-flex align="center" justify="center">
                          <span>{item.title}</span>
                        </n-flex>
                      </n-card>
                    </n-gi>
                  )
                })}
              </n-grid>
            </n-card>

            <n-card segmented={{ content: true }} bordered={false} size="small" class="mt-4">
              <n-image width="100%" src="src/assets/img/Business.svg" />
            </n-card>
          </n-gi>
        </n-grid>

        <n-grid cols="1 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen" x-gap="10" y-gap="10">
          <n-gi></n-gi>
          <n-gi></n-gi>
        </n-grid>
      </div>
    )
  },
})

export default Workbench
