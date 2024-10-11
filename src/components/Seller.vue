<!-- 商家销量统计的横向柱状图 -->
<template>
    <div class="com-container">
        <div class="com-chart" ref="seller_ref"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            chartInstance: null,
            // 服务器返回的数据
            allData: null,
            currentPage: 1, // 当前显示的页数
            totalPage: 0, // 总页数
            timeId: null, // 定时器标识
        }
    },
    mounted() {
        this.initChart()
        this.getData()
        // 监听窗口大小变化
        window.addEventListener('resize', this.screenAdapter)
        // 在页面加载完成的时候, 主动进行屏幕的适配
        this.screenAdapter()
    },
    destroyed() {
        clearInterval(this.timeId)
    },
    methods: {
        // 初始化echartInstance对象
        initChart() {
            this.chartInstance = this.$echarts.init(
                this.$refs.seller_ref,
                'chalk'
            )
            // 设置初始化图表配置
            const initOption = {
                title: {
                    text: '商家销售统计',
                    textStyle: {
                        fontSize: 66,
                    },
                    left: 20,
                    top: 20,
                },
                grids: {
                    top: '20%',
                    left: '3%',
                    right: '6%',
                    bottom: '3%',
                    contentLabel: true, //距离包含坐标轴文字
                },
                xAxis: {
                    type: 'value',
                },
                yAxis: {
                    type: 'category',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        // 修改它的层级，防止挡住其他颜色
                        z: 0,
                        lineStyle: {
                            width: 66,
                            color: '#2D3443',
                        },
                    },
                },
                series: [
                    {
                        type: 'bar',
                        barWidth: 66,
                        label: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                color: 'white',
                            },
                        },
                        itemStyle: {
                            barBorderRadius: [0, 33, 33, 0],
                            // 指明颜色渐变的方向
                            // 指明不同百分比下颜色的值
                            color: new this.$echarts.graphic.LinearGradient(
                                0,
                                0,
                                1,
                                0,
                                [
                                    // 0%状态下的颜色值
                                    {
                                        offset: 0,
                                        color: '#5052EE',
                                    },
                                    {
                                        offset: 1,
                                        color: '#AB6EE5',
                                    },
                                ]
                            ),
                        },
                    },
                ],
            }
            this.chartInstance.setOption(initOption)
            // 对图表进行鼠标事件的监听
            this.chartInstance.on('mouseover', () => {
                clearInterval(this.timeId)
            })
            this.chartInstance.on('mouseout', () => {
                this.startInterval()
            })
        },
        // 获取服务器数据
        async getData() {
            const { data: ret } = await this.$http.get('seller')
            this.allData = ret
            // 对数据从大到小排序
            this.allData.sort((a, b) => {
                return a.value - b.value
            })
            // 分页展示,每5个元素展示一页,计算总页数
            this.totalPage =
                this.allData.length % 5 === 0
                    ? this.allData.length / 5
                    : this.allData.length / 5 + 1
            this.updateChart()
            // 启动定时器
            this.startInterval()
        },
        // 更新图表
        updateChart() {
            const start = (this.currentPage - 1) * 5
            const end = this.currentPage * 5
            const showData = this.allData.slice(start, end)
            const sellerNames = showData.map((item) => {
                return item.name
            })
            const sellerValues = showData.map((item) => {
                return item.value
            })
            // 设置数据配置项
            const dataOption = {
                yAxis: {
                    data: sellerNames,
                },
                series: [
                    {
                        data: sellerValues,
                    },
                ],
            }
            this.chartInstance.setOption(dataOption)
        },
        // 每三秒切换一个分页展示数据
        startInterval() {
            // 开启定时器之前先检测timeId是否存在
            if (this.timeId) {
                clearInterval(this.timeId)
            }
            this.timeId = setInterval(() => {
                this.currentPage++
                if (this.currentPage > this.totalPage) {
                    this.currentPage = 1
                }
                this.updateChart()
            }, 3000)
        },
        // 屏幕适配,当浏览器窗口大小变化时调用的函数
        screenAdapter() {
            // 获取窗口大小:this.$refs.seller_ref.offsetWidth
            const titleFontSize =
                (this.$refs.seller_ref.offsetWidth / 100) * 3.6
            // 屏幕适配相关的配置项
            const adapterOption = {
                title: {
                    textStyle: {
                        fontSize: titleFontSize,
                    },
                },
                tooltip: {
                    axisPointer: {
                        lineStyle: {
                            width: titleFontSize,
                        },
                    },
                },
                series: [
                    {
                        barWidth: titleFontSize,
                        label: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                color: 'white',
                            },
                        },
                        itemStyle: {
                            barBorderRadius: [
                                0,
                                titleFontSize / 2,
                                titleFontSize / 2,
                                0,
                            ],
                        },
                    },
                ],
            }
            this.chartInstance.setOption(adapterOption)
            // 调用图表对象的resize方法
            this.chartInstance.resize()
        },
    },
}
</script>

<style></style>
