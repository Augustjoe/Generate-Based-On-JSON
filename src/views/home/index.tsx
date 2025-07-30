import { defineComponent, reactive } from 'vue'
import { NCard, NGrid } from 'naive-ui'
import { BorderTop20Filled } from '@vicons/fluent'

export const Home = defineComponent({
  name: 'Home',
  setup: () => {
    const formData = reactive<Record<string, string>>({})

    return () => {
      return (
        <div style={{}}>
          <div class={'heardCard'}>
            <n-grid cols="1 s:2 m:3 l:8 xl:8 2xl:8" item-responsive>
              <n-grid-item span=""></n-grid-item>
            </n-grid>
            <NCard
              contentStyle={{
                paddingTop: '24px',
                borderTop: '1px solid #e8e8e8',
              }}
              footerStyle={{
                paddingTop: '24px',
                borderTop: '1px solid #e8e8e8',
              }}
            >
              {{
                header: () => '访问量',
                'header-extra': () => <span>2023-10-01</span>,
                default: () => <span>1000</span>,
                footer: () => <span>今日访问量</span>,
              }}
            </NCard>
          </div>
        </div>
      )
    }
  },
})

export default Home
