import { defineComponent, reactive } from 'vue'
import Form from '@/components/Form'
import { NSpace, NButton } from 'naive-ui'

export const test = {
  routes: [
    {
      path: '/',
      name: 'home',
      component: defineComponent({
        name: 'Home',
        setup: () => {
          const formData = reactive<Record<string, string>>({})
          return { formData }
        },
        render() {
          return (
            <div
              style={{
                width: '400px',
              }}
            >
              <Form
                formData={this.formData}
                formProps={{
                  labelPlacement: 'left',
                  labelWidth: 'auto',
                }}
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
                        <NButton>取消</NButton>
                        <NButton
                          type="primary"
                          onClick={() => {
                            console.log(this.formData.text)
                          }}
                        >
                          确定
                        </NButton>
                      </NSpace>
                    ),
                  },
                ]}
                GridProps={{
                  cols: 12,
                }}
              ></Form>
            </div>
          )
        },
      }),
    },
  ],
}
