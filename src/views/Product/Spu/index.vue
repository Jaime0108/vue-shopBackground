<template>
  <div id="spu">
    <Selector
      @selectIdComplate="selectIdComplate"
      :isSelectable="screen != 1"
    ></Selector>
    <el-card>
      <!-- 展示区域 -->
      <div v-show="screen == 1">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSpuSwitchToEditArea"
          :disabled="!selectedIdObj.selectedCategory3Id"
          >添加SPU</el-button
        >

        <el-table :data="spuList" style="width: 100%; margin: 20px 0" border>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="SPU名称"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="描述"
            width="width"
          ></el-table-column>
          <el-table-column label="操作" width="240">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                @click="addSkuSwitchToEditArea(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="changeSpuSwitchToEditArea(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                @click="showSkuListDialog(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定删除${row.spuName}吗？`"
                @onConfirm="deleteSpuConfirm(row.id)"
                style="margin: 0 0 0 10px"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[3, 5, 7]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
        >
        </el-pagination>
      </div>
      <AddOrUpdateSpu
        v-show="screen == 2"
        ref="AddOrUpdateSpu"
        @editSwitchToShowTable="editSwitchToShowTable"
      ></AddOrUpdateSpu>

      <AddSku
        ref="AddSku"
        v-show="screen == 3"
        @editSwitchToShowTable="editSwitchToShowTable"
      ></AddSku>
    </el-card>

<!--  -->
    <el-dialog
      :title="showSkuSpuName"
      :visible.sync="skuListDialogVisible"
      width="width"
      :close="skuListDialogBeforeClose"
    >
      <!-- :data="data" -->
      <el-table :data="skuList" style="width: 100%" v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="weight: 100px; height: 100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdateSpu from "./AddOrUpdateSpu";
import AddSku from "./AddSku";
export default {
  name: "Spu",
  data() {
    return {
      page: 1,
      limit: 5,
      selectedIdObj: {},
      spuList: [],
      total: 99,
      screen: 1,
      // 控制sku列表对话框的显示与隐藏
      skuListDialogVisible: false,
      // 显示sku列表的对话框上的spu名称
      showSkuSpuName: "",
      // sku列表
      skuList: [],
      loading: true
    };
  },
  components: {
    AddOrUpdateSpu,
    AddSku,
  },
  methods: {
    selectIdComplate(selectedIdObj) {
      this.selectedIdObj = selectedIdObj;
      this.getSpuList();
    },
    // 当选择器发生变化的时候,清空上一次
    clearLastTimeSpuList() {
      Object.assign(this._data, this.$options.data());
    },
    // 获取SPU信息列表
    async getSpuList(page = 1) {
      let res = await this.$API.spu.getSpuListReq(
        page,
        this.limit,
        this.selectedIdObj.selectedCategory3Id
      );
      if (res.code == 200) {
        this.spuList = res.data.records;
        // this.limit = res.data.size
        this.total = res.data.total;
      }
    },
    // 改变当前页码的回调
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList(this.page);
    },
    // 改变每页展示多少条数据的回调
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },
    // 添加SPU,切换到编辑区
    addSpuSwitchToEditArea() {
      this.screen = 2;
      this.$refs.AddOrUpdateSpu.addSpuInit(
        this.selectedIdObj.selectedCategory3Id
      );
    },
    // 添加SKU,切换到SKU编辑区
    addSkuSwitchToEditArea(row) {
      this.screen = 3;
      this.$refs.AddSku.addSkuPageInit({
        row: row,
        selectedIdObj: this.selectedIdObj,
      });
    },
    // 修改SPU,切换到编辑区
    changeSpuSwitchToEditArea(row) {
      this.$refs.AddOrUpdateSpu.updataSpuInit(row.id);
      // console.log(res);
      this.screen = 2;
    },
    // 响应编辑区的取消按钮的回调,从编辑区回到展示区
    editSwitchToShowTable({ screen, type }) {
      if (type == "update") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
      this.screen = screen;
    },
    async showSkuListDialog(row) {
      this.showSkuSpuName = row.spuName;
      this.skuListDialogVisible = true
      let res = await this.$API.spu.getSkuListBySpuIdReq(row.id);
      console.log(res);
      if (res.code == 200) {
        this.skuList = res.data;
        this.loading = false
      }
    },
    skuListDialogBeforeClose(){
      this.loading = true
      this.skuList = []
      // this.skuListDialogVisible = false
    },
    // 删除SPU
    async deleteSpuConfirm(spuId) {
      let res = await this.$API.spu.deleteSpuReq(spuId);
      if (res.code == 200) {
        console.log(this.spuList.length);
        this.$message.success("删除成功");
        if (this.spuList.length < 2) {
          this.page -= 1;
          this.getSpuList(this.page);
        } else {
          this.getSpuList(this.page);
        }
      }
    },
  },
};
</script>

<style>
</style>

Spu 类
Sku 实例

GET /admin/product/{page}/{limit}
获取SPU列表 还要带上三级分类ID
他这个文档的Parameter Type
body 放在请求体里
path 直接写到路径上
query params的方式拼接到路径上




GET /admin/product/getSpuById/{spuId}  spu信息
GET /admin/product/baseTrademark/getTrademarkList  品牌列表
GET /admin/product/spuImageList/{spuId} 图片
GET /admin/product/baseSaleAttrList 平台销售属性

POST /admin/product/saveSpuInfo 编辑完成保存 body

SPU页面获取数据
给SPU组件打ref,点击添加、点击修改按钮的时候用$refs获取子组件身上的方法,触发方法
每一次点击都会触发,(缓存路由可以吗)
图片上传的action和之前的一样
名字字段好像是规定好的