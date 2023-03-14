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
          name: "支付笔数",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20, 33, 15, 8, 24, 8 ,11, 12],
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