import * as eCharts from 'echarts'

export const DailyTraffic = defineComponent({
  name: 'DailyTraffic',
  props: {
    HeightArr: {
      required: false,
      type: Array as PropType<number[]>,
    },
    LowArr: {
      required: false,
      type: Array as PropType<number[]>,
    },
  },
  setup: (props) => {
    const chartRef = ref()
    const returnOptions = (HeightArr?: number[], LowArr?: number[]) => {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [
              '6:00',
              '7:00',
              '8:00',
              '9:00',
              '10:00',
              '11:00',
              '12:00',
              '13:00',
              '14:00',
              '15:00',
              '16:00',
              '17:00',
              '18:00',
              '19:00',
              '20:00',
              '21:00',
              '22:00',
              '23:00',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            type: 'line',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },

            itemStyle: {
              color: '#019680',
            },
            data: LowArr || [
              0, 51, 10, 0, 56, 120, 110, 129, 10, 50, 57, 46, 10, 12, 31, 20, 10, 5,
            ],
          },
          {
            type: 'line',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            itemStyle: {
              color: '#5ab1ef',
            },
            data: HeightArr || [
              0, 123, 154, 237, 302, 351, 400, 421, 500, 510, 470, 430, 344, 301, 264, 110, 51, 10,
            ],
          },
        ],
      }
    }

    onMounted(() => {
      eCharts.init(chartRef.value).setOption(returnOptions(props.HeightArr, props.LowArr))
    })

    return () => (
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      ></div>
    )
  },
})

export const Visits = defineComponent({
  name: 'DailyTraffic',
  props: {
    data: {
      required: false,
      type: Array as PropType<number[]>,
    },
  },
  setup: (props) => {
    const chartRef = ref()
    const returnOptions = (data?: number[]) => {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: function (params: any[]) {
            let data = params[0]
            return data.name + '<br/>' + data.marker + data.seriesName + ': ' + data.value
          },
        },
        legend: {
          data: ['访问量'],
          top: 30,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月',
          ],
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 8000,
          interval: 2000,
        },
        series: [
          {
            name: '访问量',
            type: 'bar',
            data: data || [3000, 2000, 3200, 5000, 3300, 4200, 3100, 2100, 2900, 5200, 6000, 3400],
            barWidth: '50%',
            itemStyle: {
              color: '#3398DB',
            },
          },
        ],
      }
    }

    onMounted(() => {
      eCharts.init(chartRef.value).setOption(returnOptions(props.data))
    })

    return () => (
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      ></div>
    )
  },
})
