<template>
  <div id="echart" ref="echart"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "SingleBarEchartComponent",
  mounted() {
    var myChart = echarts.init(this.$refs.echart);

    // 指定图表的配置项和数据
    var option = {
      tooltip: {},
      xAxis: {
        show: false,
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: "category",
      },
      series: [
        {
          name: "运营活动效果",
          type: "bar",
          data: [78],
          // bar的宽度
          barWidth: 30,
          color: 'cyan',
          // 柱状图的背景
          showBackground: true,
          backgroundStyle:{
            color: '#eee'
          },
          // 进度条文本
          label:{
            show:true,
            formatter: '|',
            position: 'right'
          }
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