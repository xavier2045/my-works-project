<template>
  <div ref="chartContainer" style="width: 100%; height: 360px;"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

export default defineComponent({
  name: 'IncomeShare',
  props: {
    eachData: {
      type: Array,
      required: true,
    },
    screen: {
      type: Number,
      default: 1,
      required: true,
    }
  },
  setup(props) {
    const chartContainer = ref<HTMLDivElement | null>(null);
    let myChart: echarts.ECharts | null = null;
    
    const chartOption = ref({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['任务','作品','活动'],
        show: false
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'weakFilter',
          height: 20,
          bottom: 0,
          start: 0,
          end: 26,
          handleIcon:
            'path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          showDetail: false
        },
        {
          type: 'inside',
          id: 'insideX',
          xAxisIndex: 0,
          filterMode: 'weakFilter',
          start: 0,
          end: 26,
          zoomOnMouseWheel: false,
          moveOnMouseMove: true
        },
      ],
      xAxis: {
        type: 'category',
        data: [],
        axisTick: {
            show: false
        },
        axisLine:{
          lineStyle:{
            color:'#FFFFFF'
          }
		    },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        axisLine:{
          lineStyle:{
            color:'#FFFFFF'
          }
		    },
      },
      series: []
    });

    const processData = (data: any[], screen: number) => {
      const xAxisData = data.map(item => item.time);
      const seriesData = [
        {
          name: '作品',
          type: 'bar',
          stack: 'total',
          barWidth: 12,
          label: {
            show: false
          },
          itemStyle: {
            color: '#FFFFFF',
            borderRadius: [6, 6, 6, 6]  // barBorderRadius || borderRadius
          },
          data: data.map(item => item.workAmount),
          emphasis: {
            itemStyle: {
              color: '#FFFFFF'
            }
          }
        },
        {
          name: '任务',
          type: 'bar',
          stack: 'total',
          barWidth: 12,
          barCategoryGap: 17.5,
          label: {
            show: false
          },
          itemStyle: {
            color: 'rgba(255, 255, 255, 0.68)',
            borderRadius: [6, 6, 6, 6]
          },
          data: data.map(item => item.missionAmount),
          emphasis: {
            itemStyle: {
              color: 'rgba(255, 255, 255, 0.68)'
            }
          },
        },
        {
          name: '活动',
          type: 'bar',
          stack: 'total',
          barWidth: 12,
          label: {
            show: false
          },
          itemStyle: {
            color: 'rgba(255, 255, 255, 0.38)',
            borderRadius: [6, 6, 6, 6]
          },
          data: data.map(item => item.activityAmount),
          emphasis: {
            itemStyle: {
              color: 'rgba(255, 255, 255, 0.38)'
            }
          }
        },
      ];

      // 根据 screen 值对 series 数据排序  1：作品 2：任务 3：活动
      console.log('screen', screen);
      if (screen === 1) {
        seriesData.sort((a, b) => (a.name === '作品' ? -1 : 1));
      } else if (screen === 2) {
        seriesData.sort((a, b) => (a.name === '任务' ? -1 : 1));
      } else if (screen === 3) {
        seriesData.sort((a, b) => (a.name === '活动' ? -1 : 1));
      }

      chartOption.value.xAxis.data = xAxisData;
      chartOption.value.series = seriesData;
    };

    // 模拟请求后台数据
    const fetchData = () => {
      chartInt(props.eachData);
    }

    // 渲染图表
    const chartInt = (chartData: any) => {
      if (chartContainer.value) {
        // 销毁已有的实例
        if (myChart) {
          myChart.dispose();
        }

        myChart = echarts.init(chartContainer.value);
        processData(chartData, props.screen);
        myChart.setOption(chartOption.value);
      }
    }
    const resizeChart = () => {
        if(myChart !== null) {
            myChart.resize();
        }
    }
    window.addEventListener('resize', resizeChart);

    onMounted(() => {
      fetchData();
    });

    // 监听 screen 的变化
    watch(() => props.screen, () => {
      fetchData(); // 根据新的 screen 值重新获取和处理数据
    });
    watch(() => props.eachData, () => {
      fetchData(); // 根据新的 screen 值重新获取和处理数据
    });
    return {
      chartContainer
    };
  }
});
</script>

<style scoped>
/* 可以根据需要添加自定义样式 */
</style>
