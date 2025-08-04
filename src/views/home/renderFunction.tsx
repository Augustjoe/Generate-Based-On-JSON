import { NCard, NTag, NSpace, NNumberAnimation, NIcon } from 'naive-ui'
import { ArrowDropUpFilled, ArrowDropDownFilled } from '@vicons/material'

type type = 'default' | 'success' | 'info' | 'warning' | 'error'

export const titleDefaultRender = ({
  MainNum,
  LSubTitle = '日同比',
  RSubTitle = '周同比',
  RSubNum,
  LSubNum,
  unit = '',
}: {
  MainNum: number
  LSubTitle?: string
  RSubTitle?: string
  RSubNum?: number
  LSubNum?: number
  unit?: string
}) => (
  <div>
    <div style={{ fontSize: '32px' }}>
      {unit} <NNumberAnimation show-separator from={0} to={MainNum} />
    </div>
    {RSubNum !== undefined && LSubNum !== undefined && (
      <NSpace
        align="center"
        justify="space-between"
        style={{
          whiteSpace: 'nowrap',
          flexWrap: 'nowrap',
          width: '100%',
          marginTop: '10px',
          fontSize: '14px',
          gap: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {LSubTitle} <NNumberAnimation show-separator from={0} to={RSubNum} />%{' '}
          <NIcon color="rgb(0, 255, 111)" size={24}>
            <ArrowDropUpFilled />
          </NIcon>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {RSubTitle} <NNumberAnimation show-separator from={0} to={LSubNum} />%{' '}
          <NIcon color="rgb(255, 222, 102)" size={24}>
            <ArrowDropDownFilled />
          </NIcon>
        </div>
      </NSpace>
    )}
  </div>
)

export const titleHeaderExtra = (val: string, type: type = 'default') => (
  <NTag type={type}>{val}</NTag>
)

export const titleFooter = (LVal: string, RVal: string) => (
  <NSpace style={{ width: '100%' }} align="center" justify="space-between">
    <div>{LVal}</div>
    <div>{RVal}</div>
  </NSpace>
)
