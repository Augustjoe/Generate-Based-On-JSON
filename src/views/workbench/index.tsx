import { defineComponent, reactive } from 'vue'
import Form from '@/components/Form'
import { NSpace, NButton } from 'naive-ui'

export const Workbench = defineComponent({
    name: 'workbench',
    setup: () => {
        const formData = reactive<Record<string, string>>({})
        const formItems = ref([
            {
                itemType: 'NInput',
                path: 'text',
                props: {},
                itemGiProps: {
                    label: '工作台',
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
                                formItems.value[0].itemGiProps!.label = '测试2'
                                console.log(formData, formItems.value)
                            }}
                        >
                            确定
                        </NButton>
                    </NSpace>
                ),
            },
        ])

        return { formData, formItems }
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
                    formItems={this.formItems}
                    GridProps={{
                        cols: 12,
                    }}
                ></Form>
            </div>
        )
    },
})

export default Workbench
