<template>
    <div class="chart-bar">
        <div class="chart-container" ref="chartContainer"></div>
        <div class="chart-title">
            <div class="chart-title-main">
                <div class="chart-title-zengjian">
                    <template v-if="delta === 1">
                        -
                    </template>
                    <template v-else-if="delta === 2">
                        +
                    </template>
                </div>
                <div class="chart-title-yoy">{{ extraIncome }}</div>
                <!-- <div class="chart-title-icon">
                    <template v-if="delta === 1">
                        <i class="icon font_family icon-xiajiang20"></i>
                    </template>
                    <template v-else-if="delta === 2">
                        <i class="icon font_family icon-shangzhang20"></i>
                    </template>
                    <template v-else>
                        <i class="icon font_family icon-jianhao24"></i>
                    </template>
                </div> -->
            </div>
        </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import * as echarts from 'echarts';
  
  export default defineComponent({
    name: 'FanDiagram',
    props: {
        barData: {
            type: Array,
            required: true,
        },
        extraIncome: {
            type: String,
            required: true,
        },
      screen: {
        type: Number,
        default: 1,
        required: false,
      }
    },
    setup(props) {
        const chartContainer = ref<HTMLDivElement | null>(null);
        let myChart: echarts.ECharts | null = null;

        const yoy = ref('');
        const delta = ref(0);
        const extraIncome = props.extraIncome;
        
        const chartOption = ref({
            tooltip: {
                trigger: 'item',
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['50%', '65%'],
                    avoidLabelOverlap: false,
                    padAngle: 5,
                    // emphasis: {
                    //     label: {
                    //         show: true,
                    //         fontSize: 40,
                    //         fontWeight: 'bold'
                    //     }
                    // },
                    data: [],
                    label: {
                        // normal: {
                            formatter: '{d}%',
                            rich: {
                                d: {
                                    fontSize: 16,
                                    lineHeight: 22,
                                    color: '#FFFFFF'
                                },
                            },
                            emphasis: {
                                scale: false,
                                disable: false,
                                scaleSize: 0,
                            },
                        // }
                    },
                    labelLine: {
                        // normal: {
                            show: true,
                            length: 15,
                            length2: 12,
                            lineStyle: {
                                width: 1,
                                color: 'rgba(255, 255, 255, 0.8)'
                            }
                        // }
                    }
                }
            ],
        });
  
        const processData = (data: any[], screen: number) => {
            const seriesData = data;
            // 1:作品 2:任务 3:活动
            seriesData.forEach(item => {
                item.value = Number(item.amount);
                if(item.type == 1) {
                    item.name = '作品';
                    item.itemStyle = {color: '#FFFFFF'};
                } else if(item.type == 2) { 
                    item.name = '任务';
                    item.itemStyle = {color: 'rgba(255, 255, 255, 0.68)'};
                } else if(item.type == 3) { 
                    item.name = '活动';
                    item.itemStyle = {color: 'rgba(255, 255, 255, 0.38)'};
                }
            });
            console.log('seriesData', seriesData);
            chartOption.value.series[0].data = seriesData;
        };
    
        // 模拟请求后台数据
        const fetchData = () => {
            chartInt(props.barData);
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
                // yoy.value = chartData[0].yoy;
                // delta.value = chartData[0].delta;
                // // 监听鼠标移入事件
                // myChart.on('mouseover', function (params) {
                //     if (params.seriesType === 'pie') {
                //         yoy.value = params.data.yoy;
                //         delta.value = params.data.delta;
                //     }
                // });

                // // 监听鼠标移出事件
                // myChart.on('mouseout', function (params) {
                //     // 恢复中间的默认显示内容
                //     if(myChart !== null) {
                //         yoy.value = chartData[0].yoy;
                //         delta.value = chartData[0].delta;
                //         // myChart.setOption({
                //         //     title: {
                //         //         text: `${params.data[0].yoy}`, // 恢复默认值
                //         //         subtext: `${params.data[0].name}`,
                //         //         left: 'center',
                //         //         top: 'center',
                //         //         textStyle: {
                //         //             fontSize: 24,
                //         //             fontWeight: 'bold',
                //         //             color: '#FFFFFF'
                //         //         }
                //         //     }
                //         // });
                //     }
                // });
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
        watch(() => props.barData, () => {
            fetchData(); // 根据新的 screen 值重新获取和处理数据
        });
        return {
            extraIncome,
            chartContainer,
            resizeChart,
            delta,
            yoy
        };
    }
});
  </script>
  
  <style scoped lang="scss">
    .chart-bar{
        width: 100%;
        height: 100%;
        position: relative;
        .chart-container{
            width: 100%;
            height: 100%;
        }
        .chart-title{
            display: inline-block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .chart-title-main{
                display: flex;
                font-weight: 500;
                font-size: 28px;
                color: #FFFFFF;
                line-height: 24px;
                text-align: left;
                font-style: normal;
                text-transform: none;
                .chart-title-zengjian{
                    display: inline-block;
                }
                .chart-title-yoy{
                    display: inline-block;
                }
                .chart-title-icon{
                    width: 24px;
                    height: auto;
                    i{
                        font-size: 24px;
                        color: rgb(255, 255, 255, .7);
                        display: block;
                        line-height: 24px;
                        text-align: center;
                    }
                }
            }
        }
    }
  </style>
  