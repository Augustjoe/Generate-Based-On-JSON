import { defineComponent, VNode, type Component } from 'vue'
import { NCard, NIcon, NProgress } from 'naive-ui'
import { titleDefaultRender, titleHeaderExtra, titleFooter } from './renderFunction'
import {
  UsergroupAddOutlined,
  BarChartOutlined,
  ShoppingCartOutlined,
  AccountBookOutlined,
  CreditCardOutlined,
  MailOutlined,
  TagsOutlined,
  SettingOutlined,
} from '@vicons/antd'

import { DailyTraffic, Visits } from './echartData'

export const Home = defineComponent({
  name: 'Home',
  setup: () => {
    const cssIconCard = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }

    const titleCards: {
      header: () => string | VNode
      'header-extra': () => string | VNode
      default: () => string | VNode
      footer: () => string | VNode
    }[] = [
      {
        header: () => '访问量',
        'header-extra': () => titleHeaderExtra('日', 'success'),
        default: () =>
          titleDefaultRender({
            MainNum: 89621,
            RSubNum: 71234,
            LSubNum: 35345,
          }),
        footer: () => titleFooter('今日访问量', '8961'),
      },
      {
        header: () => '销售额',
        'header-extra': () => titleHeaderExtra('周', 'info'),
        default: () => (
          <>
            {titleDefaultRender({
              MainNum: 59621,
              unit: '¥',
            })}
            <div style={{ margin: '10px 0px' }}>
              <NProgress type="line" indicator-placement="inside" processing percentage={78.33} />
            </div>
          </>
        ),
        footer: () => titleFooter('今日访问量', '8961'),
      },
      {
        header: () => '订单量',
        'header-extra': () => titleHeaderExtra('周', 'warning'),
        default: () =>
          titleDefaultRender({
            MainNum: 34561,
            RSubNum: 11332,
            LSubNum: 10634,
          }),
        footer: () => titleFooter('转化率', '49,918%'),
      },
      {
        header: () => '成交额',
        'header-extra': () => titleHeaderExtra('月', 'error'),
        default: () =>
          titleDefaultRender({
            MainNum: 50836,
            RSubNum: 35544,
            LSubNum: 26159,
            RSubTitle: '月同比',
            LSubTitle: '月环比',
            unit: '¥',
          }),
        footer: () => titleFooter('总成交额', '¥1,234,567'),
      },
    ]

    const iconList: {
      icon: Component
      title: string
      color: string
      click: () => void
    }[] = [
      {
        icon: UsergroupAddOutlined,
        title: '用户',
        color: '#69c0ff',
        click: () => {},
      },
      {
        icon: BarChartOutlined,
        title: '分析',
        color: '#69c0ff',
        click: () => {},
      },
      {
        icon: ShoppingCartOutlined,
        title: '商品',
        color: '#ff9c6e',
        click: () => {},
      },
      {
        icon: AccountBookOutlined,
        title: '订单',
        color: '#b37feb',
        click: () => {},
      },
      {
        icon: CreditCardOutlined,
        title: '票据',
        color: '#ffd666',
        click: () => {},
      },
      {
        icon: MailOutlined,
        title: '消息',
        color: '#5cdbd3',
        click: () => {},
      },
      {
        icon: TagsOutlined,
        title: '标签',
        color: '#ff85c0',
        click: () => {},
      },
      {
        icon: SettingOutlined,
        title: '配置',
        color: '#ffc069',
        click: () => {},
      },
    ]

    return () => {
      return (
        <div style={{ padding: '20px' }}>
          <div class={'heardCard'}>
            <n-grid cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen" x-gap={16} y-gap={16}>
              {titleCards.map((card) => (
                <n-grid-item>
                  <NCard
                    bordered={false}
                    contentStyle={{
                      padding: '20px',
                    }}
                    footerStyle={{
                      padding: '16px 20px',
                      background: 'var(--tag-bg-color, #fafafa)',
                      fontSize: '14px',
                      borderBottomLeftRadius: '12px',
                      borderBottomRightRadius: '12px',
                    }}
                    style={{ borderRadius: '12px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}
                    v-slots={card}
                  ></NCard>
                </n-grid-item>
              ))}
            </n-grid>
          </div>

          <div class={'iconList'} style={{ marginTop: '20px' }}>
            <n-grid cols="2 s:4 m:4 l:8 xl:8 2xl:8" responsive="screen" x-gap="16" y-gap="16">
              {iconList.map((item) => (
                <n-grid-item>
                  <NCard content-style="padding: 16px 0;" size="small" bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)', cursor: 'pointer', transition: 'transform 0.2s' }} hoverable>
                    <div onClick={item.click}>
                      <p style={{ ...cssIconCard, paddingBottom: '8px' }}>
                        <NIcon component={item.icon} size="36" color={item.color} />
                      </p>
                      <p style={{...cssIconCard, fontWeight: 500, color: '#555'}}>{item.title}</p>
                    </div>
                  </NCard>
                </n-grid-item>
              ))}
            </n-grid>
          </div>

          <NCard
            bordered={false}
            style={{
              width: '100%',
              marginTop: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
            }}
          >
            <n-tabs type="line" animated pane-style={{ height: '400px', paddingTop: '20px' }}>
              <n-tab-pane name="流量趋势" tab="流量趋势">
                <DailyTraffic />
              </n-tab-pane>
              <n-tab-pane name="访问量" tab="访问量">
                <Visits />
              </n-tab-pane>
            </n-tabs>
          </NCard>
        </div>
      )
    }
  },
})

export default Home
