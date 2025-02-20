import { defineComponent } from 'vue'
import Form from '@/components/Form'
import { NSpace, NButton } from 'naive-ui'

export const test = {
  routes: [
    {
      path: '/',
      name: 'home',
      component: defineComponent({
        name: 'Home',
        render: () => (
          <div
            style={{
              width: '400px',
            }}
          >
            <Form
              formItems={[
                {
                  itemType: 'NInput',
                  path: 'text',
                  props: {},
                  itemGiProps: {
                    label: '测试',
                    span: 12,
                  },
                },
                {
                  itemType: 'render',
                  render: () => (
                    <NSpace>
                      <NButton>测试</NButton>
                    </NSpace>
                  ),
                },
              ]}
              GridProps={{
                cols: 12,
              }}
            ></Form>
          </div>
        ),
      }),
    },
  ],
}
