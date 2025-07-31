import { defineComponent, reactive, VNode } from 'vue'
import { NCard, NIcon, NProgress } from 'naive-ui'
import { titleDefaultRender, titleHeaderExtra, titleFooter } from "./renderFunction"
import {
  CaretUpOutlined,
  CaretDownOutlined,
  UsergroupAddOutlined,
  BarChartOutlined,
  ShoppingCartOutlined,
  AccountBookOutlined,
  CreditCardOutlined,
  MailOutlined,
  TagsOutlined,
  SettingOutlined,
} from '@vicons/antd';


export const Home = defineComponent({
  name: 'Home',
  setup: () => {
    const formData = reactive<Record<string, string>>({})
    const cssIconCard = {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }


    const titleCards: {
      header: (() => string | VNode),
      'header-extra': (() => string | VNode),
      default: (() => string | VNode),
      footer: (() => string | VNode),
    }[] = [
        {
          header: () => '访问量',
          'header-extra': () => titleHeaderExtra('日', 'success'),
          default: () => titleDefaultRender({
            MainNum: 89621,
            RSubNum: 71234,
            LSubNum: 35345,
          }),
          footer: () => titleFooter('今日访问量', '8961'),
        },
        {
          header: () => '销售额',
          'header-extra': () => titleHeaderExtra('周', 'info'),
          default: () => <>
            {titleDefaultRender({
              MainNum: 59621,
              unit: '¥',
            })}
            <div style={{ margin: '10px 0px' }}>
              <NProgress type="line" indicator-placement="inside" processing percentage={78.33} />
            </div>
          </>,
          footer: () => titleFooter('今日访问量', '8961'),
        },
        {
          header: () => '订单量',
          'header-extra': () => titleHeaderExtra('周', 'warning'),
          default: () => titleDefaultRender({
            MainNum: 34561,
            RSubNum: 11332,
            LSubNum: 10634,
          }),
          footer: () => titleFooter('转化率', '49,918%'),
        },
        {
          header: () => '成交额',
          'header-extra': () => titleHeaderExtra('月', 'error'),
          default: () => titleDefaultRender({
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
      icon: Component,
      title: string,
      color: string,
      click: () => void,
    }[] = [
        {
          icon: UsergroupAddOutlined,
          title: '用户',
          color: '#69c0ff',
          click: () => { },

        },
        {
          icon: BarChartOutlined,
          title: '分析',
          color: '#69c0ff',
          click: () => { },
        },
        {
          icon: ShoppingCartOutlined,
          title: '商品',
          color: '#ff9c6e',
          click: () => { },
        },
        {
          icon: AccountBookOutlined,
          title: '订单',
          color: '#b37feb',
          click: () => { },
        },
        {
          icon: CreditCardOutlined,
          title: '票据',
          color: '#ffd666',
          click: () => { },
        },
        {
          icon: MailOutlined,
          title: '消息',
          color: '#5cdbd3',
          click: () => { },
        },
        {
          icon: TagsOutlined,
          title: '标签',
          color: '#ff85c0',
          click: () => { },
        },
        {
          icon: SettingOutlined,
          title: '配置',
          color: '#ffc069',
          click: () => { },
        },
      ];

    return () => {
      return (
        <div style={{}}>
          <div class={'heardCard'}>
            <n-grid cols="1 s:2 m:3 l:4 xl:4 2xl:4"
              responsive="screen"
              x-gap={12}
              y-gap={8}>
              {titleCards.map((card) =>
                <n-grid-item>
                  <NCard
                    contentStyle={{
                      padding: '15px 20px',
                      borderTop: '1px solid #e8e8e8',
                    }}
                    footerStyle={{
                      padding: '15px 20px',
                      borderTop: '1px solid #e8e8e8',
                      fontSize: '14px',
                    }}
                  >
                    {card}
                  </NCard>
                </n-grid-item>
              )}
            </n-grid>
          </div>

          <div class={'iconList'} style={{ marginTop: '10px' }}>
            <n-grid cols="1 s:2 m:3 l:8 xl:8 2xl:8" responsive="screen" x-gap="16" y-gap="8">
              {iconList.map((item) => <n-grid-item>
                <NCard content-style="padding-top: 0;" size="small" bordered={false} >
                  <div onClick={item.click}>
                    <p style={{ ...cssIconCard,padding:'12px'  }}>
                      <NIcon component={item.icon} size="32" color={item.color} />
                    </p>
                    <p style={cssIconCard}>
                      {item.title}
                    </p>
                  </div>
                </NCard>
              </n-grid-item>)
              }
            </n-grid>

          </div>

        </div>
      )
    }
  },
})

export default Home
