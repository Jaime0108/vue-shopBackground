<template>
  <el-card class="selector">
    <el-form :inline="true" :model="selectedIdObj" class="demo-form-inline" :disabled="isSelectable">
      <el-form-item label="一级菜单">
        <el-select
          v-model="selectedIdObj.selectedCategory1Id"
          @change="select1IdComplated"
          placeholder="请选择"
        >
          <el-option
            v-for="(c1, index) in category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级菜单">
        <el-select
          v-model="selectedIdObj.selectedCategory2Id"
          @change="select2IdComplated"
          placeholder="请选择"
        >
          <el-option
            v-for="(c2, index) in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级菜单">
        <el-select
          v-model="selectedIdObj.selectedCategory3Id"
          @change="select3IdComplated"
          placeholder="请选择"
        >
          <el-option
            v-for="(c3, index) in category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Selector",
  mounted() {
    this.$API.selector.getCategory1ListReq().then((res) => {
      this.category1List = res.data;
    });
  },
  props:['isSelectable'],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      selectedIdObj: {
        selectedCategory1Id: "",
        selectedCategory2Id: "",
        selectedCategory3Id: "",
      },
    };
  },
  methods: {
    // 一级菜单选择完成,清空二、三级菜单的ID,清空三级菜单的数据,二级菜单的数据由服务器返回的结果覆盖
    select1IdComplated(select1Id) {
      // this.category2List = []
      this.category3List = [];
      this.selectedIdObj.selectedCategory2Id = "";
      this.selectedIdObj.selectedCategory3Id = "";
      this.$API.selector.getCategory2ListReq(select1Id).then((res) => {
        this.category2List = res.data;
      });
      // console.log(this.$parent.clearLastTimeSpuList);
      this.$parent.clearLastTimeSpuList()
    },

    select2IdComplated(select2Id) {
      // this.category3List = []
      this.selectedIdObj.selectedCategory3Id = "";
      this.$API.selector.getCategory3ListReq(select2Id).then((res) => {
        this.category3List = res.data;
      });
      this.$parent.clearLastTimeSpuList()
    },
    select3IdComplated() {
      this.$emit('selectIdComplate',this.selectedIdObj)
    },
  },
};
</script>

<style lang="scss" scoped>
.selector{
    margin-bottom: 20px;
}
</style>