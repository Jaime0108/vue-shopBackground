<template>
  <div id="echart" ref="echart"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineEchartComponent",
  mounted() {
    var myChart = echarts.init(this.$refs.echart);

    // 指定图表的配置项和数据
    var option = {
      tooltip: {},
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          name: "销量",
          type: "line",
          data: [5, 20, 36, 10, 10, 20],
          smooth: true,
          symbol: "none",
          // 这个配置项和symbol一样的吧
          itemStyle: {
            opacity: 0,
          },
          // 线条的样式
          lineStyle: {
            color: "purple",
          },
          // 填充区的样式
          areaStyle: {
            // 颜色渐变
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      grid: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  },
};
</script>

<style lang="scss">
#echart {
  width: 100%;
  height: 100%;
}
</style>