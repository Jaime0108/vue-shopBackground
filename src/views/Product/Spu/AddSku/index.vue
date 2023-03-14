<template>
  <el-form ref="form" label-width="120px">
    <el-form-item label="SPU名称">
      {{ spuName }}
    </el-form-item>
    <el-form-item label="SKU名称">
      <el-input
        placeholder="请输入SKU名称"
        style="width: 50%"
        v-model="skuInfo.skuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="价格（元）">
      <!-- type="number" -->
      <el-input
        placeholder="请输入价格"
        style="width: 50%"
        v-model="skuInfo.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量（千克）">
      <el-input
        placeholder="请输入重量"
        style="width: 50%"
        v-model="skuInfo.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input type="textarea" v-model="skuInfo.skuDesc"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item
          :label="attrInfo.attrName"
          v-for="(attrInfo, index) in attrInfoList"
          :key="attrInfo.id"
        >
          <el-select
            placeholder="请选择属性值"
            v-model="attrInfo.selectedAttrIdAndAttrValueId"
          >
            <el-option
              :label="attrValue.valueName"
              :value="`${attrInfo.id}:${attrValue.id}`"
              v-for="(attrValue, index) in attrInfo.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台属性">
          <el-select placeholder="请选择属性值" value="">
            <el-option label="区域一" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item
          :label="spuSaleAttr.saleAttrName"
          v-for="(spuSaleAttr, index) in spuSaleAttrList"
          :key="spuSaleAttr.id"
        >
          <el-select
            placeholder="请选择属性值"
            v-model="spuSaleAttr.selectedSaleAttrIdAndSaleAttrValueId"
          >
            <el-option
              :label="spuSaleAttrValue.saleAttrValueName"
              :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"
              v-for="(
                spuSaleAttrValue, index
              ) in spuSaleAttr.spuSaleAttrValueList"
              :key="spuSaleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table
        :data="spuImageList"
        style="width: 70%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" align="center">
        </el-table-column>
        <el-table-column label="图片" width="width" align="center">
          <template slot-scope="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px" />
          </template>
        </el-table-column>
        <el-table-column
          prop="imgName"
          label="名称"
          width="width"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="{ row, $index }">
            <el-button type="success" v-if="row.isDefault == 1">默认</el-button>
            <el-button type="primary" v-else @click="changeDefault(row)"
              >设置默认</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addSkuConfirm">保存</el-button>
      <el-button @click="switchToShowTbale">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "AddSku",
  data() {
    return {
      spuName: "",
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],

      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,

        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",

        skuDefaultImg: "",

        skuAttrValueList: [
          //   {
          //     attrId: 0,
          //     attrName: "string",
          //     id: 0,
          //     skuId: 0,
          //     valueId: 0,
          //     valueName: "string",
          //   },
        ],

        skuImageList: [
          //   {
          //     id: 0,
          //     imgName: "string",
          //     imgUrl: "string",
          //     isDefault: "string",
          //     skuId: 0,
          //     spuImgId: 0,
          //   },
        ],

        skuSaleAttrValueList: [
          //   {
          //     id: 0,
          //     saleAttrId: 0,
          //     saleAttrName: "string",
          //     saleAttrValueId: 0,
          //     saleAttrValueName: "string",
          //     skuId: 0,
          //     spuId: 0,
          //   },
        ],
      },
    };
  },
  methods: {
    async addSkuPageInit(obj) {
      const { row: spuInfo, selectedIdObj } = obj;
      this.spuName = spuInfo.spuName;
      const { id: spuId, tmId: tmId } = spuInfo;
      const { selectedCategory1Id, selectedCategory2Id, selectedCategory3Id } =
        selectedIdObj;

      this.skuInfo.category3Id = selectedCategory3Id;
      this.skuInfo.spuId = spuId;
      this.skuInfo.tmId = tmId;

      let getSpuImageListResult = await this.$API.spu.getSpuImageListReq(spuId);
      // console.log(getSpuImageListResult);
      if (getSpuImageListResult.code == 200) {
        getSpuImageListResult.data.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = getSpuImageListResult.data;
      }

      let getSpuSaleAttrListByIdResult =
        await this.$API.spu.getSpuSaleAttrListByIdReq(spuId);
      // console.log(getSpuSaleAttrListByIdResult);
      if (getSpuSaleAttrListByIdResult.code == 200) {
        this.spuSaleAttrList = getSpuSaleAttrListByIdResult.data;
      }

      let getAttrInfoListResult = await this.$API.attr.getAttrInfoListReq(
        selectedCategory1Id,
        selectedCategory2Id,
        selectedCategory3Id
      );
      //   console.log(getAttrInfoListResult);
      if (getAttrInfoListResult.code == 200) {
        this.attrInfoList = getAttrInfoListResult.data;
      }
    },
    // table表格复选框选择的回调
    handleSelectionChange(selectedObjList) {
      selectedObjList.forEach((item) => {
        item.spuImgId = item.id;
      });
      this.skuInfo.skuImageList = selectedObjList;
    },
    // 切换默认图片
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 点击保存按钮 整理参数 发请求
    async addSkuConfirm() {
      // 整理品台属性
      this.attrInfoList.forEach((item) => {
        if (item.selectedAttrIdAndAttrValueId) {
          let res = item.selectedAttrIdAndAttrValueId.split(":");
          this.skuInfo.skuAttrValueList.push({
            attrId: res[0],
            valueId: res[1],
          });
        }
      });
      // 整理销售属性
      this.spuSaleAttrList.forEach((item) => {
        if (item.selectedSaleAttrIdAndSaleAttrValueId) {
          let res = item.selectedSaleAttrIdAndSaleAttrValueId.split(":");
          this.skuInfo.skuSaleAttrValueList.push({
            saleAttrId: res[0],
            saleAttrValueId: res[1],
          });
        }
      });

      let res = await this.$API.spu.addSkuConfirmReq(this.skuInfo);
      if (res.code == 200) {
        this.$emit("editSwitchToShowTable", { screen: 1, type: "update" });
      }
    },
    // 点击取消按钮,切换到展示区域
    switchToShowTbale() {
      this.$emit("editSwitchToShowTable", { screen: 1, type: "update" });
    },
  },
};
</script>

<style>
</style>

获取spu的图片列表
GET /admin/product/spuImageList/{spuId} spu里已经写过了
获取spu的销售属性
GET /admin/product/spuSaleAttrList/{spuId}
获取平台属性、属性值列表
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} attr里这个也写过了
保存数据
POST /admin/product/saveSkuInfo
skuInfo:{
  "category3Id": 0,
  "createTime": "2023-02-27T02:58:42.037Z",
  "id": 0,
  "isSale": 0,
  "price": 0,
  "skuAttrValueList": [
    {
      "attrId": 0,
      "attrName": "string",
      "id": 0,
      "skuId": 0,
      "valueId": 0,
      "valueName": "string"
    }
  ],
  "skuDefaultImg": "string",
  "skuDesc": "string",
  "skuImageList": [
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "isDefault": "string",
      "skuId": 0,
      "spuImgId": 0
    }
  ],
  "skuName": "string",
  "skuSaleAttrValueList": [
    {
      "id": 0,
      "saleAttrId": 0,
      "saleAttrName": "string",
      "saleAttrValueId": 0,
      "saleAttrValueName": "string",
      "skuId": 0,
      "spuId": 0
    }
  ],
  "spuId": 0,
  "tmId": 0,
  "weight": "string"
}

平台属性要收集的数据
skuAttrValueList:[
    {
        attrId:0,
        valueId: 0
    }
]
他是收集到了请求回来的平台属性列表里的
attrInfoList.reduce((prev,item)=>{
    if(item.attrIdAndValueId){
        const[attrId, valueId] = item.attrIdAndValueId.split(':')
        prev.push({attrId,valueId})
    }
    return prev
},[])

销售属性的收集同理
销售属性值要收集的数据
{
    saleAttrId
    saleAttrValueId
}

图片列表
需要字段
{
    imgName:''
    imgUrl:''
    isDefault: ''
    spuImgId:0
}