<template>
  <el-col :span="6">
    <el-card>
      <div class="title">
        <span>{{title}}</span>
        <i class="el-icon-info"></i>
      </div>
      <div class="number">{{number}}</div>
      <div class="echart">
        <slot name="echart"></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
    </el-card>
  </el-col>
</template>

<script>
export default {
  name: "ColCard",
  props:['title','number',]
};
</script>

<style lang="scss" scoped>
.el-card {
  .title {
    display: flex;
    justify-content: space-between;
    color: #aaa;
  }
  .number {
    font-size: 24px;
    font-weight: 700;
    margin: 10px 0;
  }
  .echart {
    height: 80px;
  }
  .footer {
    padding-top: 10px;
    border-top: 1px solid #eee;
  }
}
</style>