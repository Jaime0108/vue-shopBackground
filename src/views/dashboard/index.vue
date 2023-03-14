<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <el-row :gutter="20">
      <ColCard title="总销售额" number="￥ 126560" f>
        <template slot="echart">
          周同比
          <span
            >56.67%<i class="el-icon-caret-top" style="color: red"></i
          ></span>
          日同比
          <span
            >19.16%<i class="el-icon-caret-bottom" style="color: green"></i
          ></span>
        </template>

        <template slot="footer">
          <p>日销售额￥ 12423</p>
        </template>
      </ColCard>
      <ColCard title="访问量" number="88460">
        <template slot="echart">
          <LineEchartComponent></LineEchartComponent>
        </template>
        <template slot="footer">
          <p>日访问量1234</p>
        </template>
      </ColCard>
      <ColCard title="支付笔数" number="88460">
        <template slot="echart">
          <BarEchartComponent></BarEchartComponent>
        </template>
        <template slot="footer">
          <p>转化率65%</p>
        </template>
      </ColCard>
      <ColCard title="运营活动效果" number="78%">
        <template slot="echart">
          <SingleBarEchartComponent></SingleBarEchartComponent>
        </template>
        <template slot="footer">
          <p>
            周同比
            <span
              >56.67%<i class="el-icon-caret-top" style="color: red"></i
            ></span>
            日同比
            <span
              >19.16%<i class="el-icon-caret-bottom" style="color: green"></i
            ></span>
          </p>
        </template>
      </ColCard>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ColCard from "./ColCard";
import LineEchartComponent from "./LineEchartComponent";
import BarEchartComponent from "./BarEchartComponent";
import SingleBarEchartComponent from "./SingleBarEchartComponent";
export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  components: {
    ColCard,
    LineEchartComponent,
    BarEchartComponent,
    SingleBarEchartComponent
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

最上面的四个Card, 拆分Card组件

