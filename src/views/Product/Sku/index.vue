<template>
  <div id="Sku">
    <el-table :data="skuList" style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="width"
      ></el-table-column>
      <el-table-column
        prop="skuName"
        label="名称"
        width="width"
      ></el-table-column>
      <el-table-column
        prop="skuDesc"
        label="描述"
        width="width"
      ></el-table-column>
      <el-table-column prop="skuDefaultImg" label="默认图片" width="width">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="weight"
        label="重量(KG)"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="价格(元)"
        width="80"
      ></el-table-column>
      <el-table-column label="操作" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-bottom"
            size="mini"
            v-if="row.isSale == 1"
            @click="changeIsSaleState(row)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-top"
            size="mini"
            v-else
            @click="changeIsSaleState(row)"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="this.$message.warning('正在开发中...')"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-info"
            size="mini"
            @click="showSkuDetail(row)"
          ></el-button>
          <el-popconfirm
            :title="`确定删除${row.skuName}吗？`"
            @onConfirm="deleteSkuConfirm(row.id)"
            style="margin: 0 0 0 10px"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              slot="reference"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- :direction="direction"
      :before-close="handleClose" -->
    <el-drawer :visible.sync="drawerVisible" :show-close="false" size="50%">
      <el-row :gutter="20">
        <el-col :span="5">名称</el-col>
        <el-col :span="19">{{ skuDetailInfo.skuName }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">价格</el-col>
        <el-col :span="19">{{ skuDetailInfo.price }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">重量</el-col>
        <el-col :span="19">{{ skuDetailInfo.weight }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">描述</el-col>
        <el-col :span="19">{{ skuDetailInfo.skuDesc }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">图片</el-col>
        <el-col :span="19">
          <div width="120px">
            <el-carousel height="480px">
              <el-carousel-item
                v-for="(image, index) in skuDetailInfo.skuImageList"
                :key="image.id"
              >
                <img :src="image.imgUrl" alt="" style="height: 480px" />
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
    </el-drawer>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 7, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Sku",
  mounted() {
    this.getSkuList();
  },
  data() {
    return {
      page: 1,
      limit: 10,
      skuList: [],
      total: 99,
      drawerVisible: false,
      skuDetailInfo: {},
    };
  },
  methods: {
    async getSkuList() {
      let res = await this.$API.sku.getSkuListReq(this.page, this.limit);
      if (res.code == 200) {
        this.skuList = res.data.records;
        this.total = res.total;
      }
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getSkuList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getSkuList();
    },
    // 改变sku的上架、下架状态
    async changeIsSaleState(row) {
      // row.isSale = !row.isSale
      if (row.isSale == 1) {
        let res = await this.$API.sku.skuChangeToCancelSale(row.id);
        if (res.code == 200) {
          row.isSale = 0;
          this.$message.warning(`${row.skuName}已下架`);
        }
      } else if (row.isSale == 0) {
        let res = await this.$API.sku.skuChangeToOnSale(row.id);
        if (res.code == 200) {
          row.isSale = 1;
          this.$message.success(`${row.skuName}已上架`);
        }
      }
    },
    // 展示sku的详细信息
    async showSkuDetail(row) {
      this.drawerVisible = true;
      let res = await this.$API.sku.getSkuInfoById(row.id);
      if (res.code == 200) {
        this.skuDetailInfo = res.data;
      }
    },
    // 删除sku
    async deleteSkuConfirm(skuId) {
      let res = await this.$API.sku.deleteSkuReq(skuId);
      if (res.code == 200) {
        this.$message.success("删除成功");
        if (this.skuList.length < 2) {
          this.page -= 1;
        }
        this.getSkuList();
      }
    },
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-col-5 {
  font-size: 20px;
  font-weight: bold;
  text-align: right;
}
</style>

GET /admin/product/getSkuById/{skuId}
获取sku详细信息
GET /admin/product/onSale/{skuId} 上架
GET /admin/product/cancelSale/{skuId} 下架
DELETE /admin/product/deleteSku/{skuId} 删除