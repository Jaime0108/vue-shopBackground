<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input
          placeholder="请输入SPU名称"
          style="width: 50%"
          v-model="spuInfo.spuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="选择品牌" v-model="spuInfo.tmId">
          <el-option
            v-for="(tm, index) in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" v-model="spuInfo.description"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-success="handleAvatarSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectedSaleAttrList.length}项未选择`"
          v-model="selectThisSpuDoNotHaveSaleAttrInfo"
        >
          <el-option
            v-for="(unSelectedSaleAttr, index) in unSelectedSaleAttrList"
            :key="unSelectedSaleAttr.id"
            :label="unSelectedSaleAttr.name"
            :value="`${unSelectedSaleAttr.id}:${unSelectedSaleAttr.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          @click="selectThisSpuDoNotHaveSaleAttrInfoConfirm"
          :disabled="!selectThisSpuDoNotHaveSaleAttrInfo"
          >添加销售属性</el-button
        >
        <!-- :data="data" -->
        <el-table :data="spuInfo.spuSaleAttrList" style="width: 100%" border>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="销售属性"
            width="140"
            align="center"
          ></el-table-column>

          <el-table-column label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(row.spuSaleAttrValueList, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                ref="saveTagInput"
                size="small"
                v-model="row.inputValue"
                @blur="handleInputConfirm(row)"
                @keyup.enter.native="$event.target.blur"
              ></el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >添加新属性值</el-button
              >
            </template>
          </el-table-column>

          <el-table-column
            prop="prop"
            label="操作"
            width="80"
            align="center"
          ><template slot-scope="{row, $index}">
            <el-button type="danger" icon="el-icon-delete" @click="deleteSpuSaleAttr($index)"></el-button>
          </template></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpuConfirm"
          >保存</el-button
        >
        <el-button @click="switchToShowTbale">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "AddOrUpdateSpu",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,

      spuInfo: {
        // 当前spu的ID,新增的时候没有
        id: undefined,
        // 品牌ID
        tmId: undefined,
        // 三级分类ID
        category3Id: undefined,
        // SPU名称
        spuName: "",
        // 描述
        description: "",
        // 图片列表 获取spuInfo时是空的 完全是为了在提交的时候用的
        spuImageList: [
          //   {
          //     id: undefined,
          //     imgName: "string",
          //     imgUrl: "string",
          //     spuId: undefined,
          //   },
        ],
        // 当前spu的销售属性列表
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: undefined,
          //   id: undefined,
          //   saleAttrName: "string",
          //   spuId: undefined,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: undefined,
          //       id: undefined,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: undefined,
          //     },
          //   ],
          // },
        ],
      },
      // Spu图片列表 正常来说spuImageList里应该有的 但事实就是没有 还得多写一条数据
      spuImageList: [
        // {
        //   id: 5436
        //   imgName: "389927841028319227.jpg"
        //   imgUrl: "http://139.198.127.41:9000/sph/20230225/389927841028319227.jpg"
        //   spuId: 2333
        // },
      ],
      // 平台所有的销售属性 spuInfo里的是当前spu的销售属性
      platformAllSaleAttrList: [
        // {
        //   id: 1,
        //   name: "颜色",
        // },
      ],
      // 平台所有的品牌信息
      trademarkList: [
        {
          // id: 6541
          // logoUrl: "http://47.93.148.192:8080/group1/M00/09/2F/rBHu8mP50jOAVPSwAAAgteNer18888.jpg"
          // tmName: "苹果手机"
        },
      ],
      // 收集选择当前SPU上没有的销售属性
      selectThisSpuDoNotHaveSaleAttrInfo: "",
    };
  },
  computed: {
    // [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
    // afterComputedSpuImageList() {
    //   let afterComputedSpuImageList = [];
    //   this.spuImageList.forEach((imageObj) => {
    //     afterComputedSpuImageList.push({
    //       name: imageObj.imgName,
    //       url: imageObj.imgUrl,
    //     });
    //   });
    //   return afterComputedSpuImageList;
    // },
    unSelectedSaleAttrList() {
      return this.platformAllSaleAttrList.filter((item) => {
        return this.spuInfo.spuSaleAttrList.every((item2) => {
          return item.name != item2.saleAttrName;
        });
      });
    },
  },
  methods: {
    // 为展示区 点击修改按钮 初始化编辑区的数据 准备的函数
    async updataSpuInit(spuId) {
      let getSpuInfoResult = await this.$API.spu.getSpuByIdReq(spuId);
      console.log("getSpuInfoResult", getSpuInfoResult);
      if (getSpuInfoResult.code == 200) {
        this.spuInfo = getSpuInfoResult.data;
      }

      let getTrademarkListResult = await this.$API.spu.getTrademarkListReq();
      console.log("getTrademarkListResult", getTrademarkListResult);
      if (getTrademarkListResult.code == 200) {
        this.trademarkList = getTrademarkListResult.data;
      }

      // 获取Spu图片列表 正常来说getSpuInfoResult里应该有的 但事实就是没有 还要多写一条请求
      let getSpuImageListResult = await this.$API.spu.getSpuImageListReq(spuId);
      console.log("getSpuImageListResult", getSpuImageListResult);
      if (getSpuImageListResult.code == 200) {
        getSpuImageListResult.data.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = getSpuImageListResult.data;
      }
      //   获取平台所有的销售属性 getSpuInfoResult里的只是当前Spu已有的
      let getBaseSaleAttrListResult =
        await this.$API.spu.getBaseSaleAttrListReq();
      console.log("getBaseSaleAttrListResult", getBaseSaleAttrListResult);
      if (getBaseSaleAttrListResult.code == 200) {
        this.platformAllSaleAttrList = getBaseSaleAttrListResult.data;
      }
    },

    async addSpuInit(selectedCategory3Id){
      Object.assign(this._data, this.$options.data());
      this.spuInfo.category3Id = selectedCategory3Id
      let getTrademarkListResult = await this.$API.spu.getTrademarkListReq();
      console.log("getTrademarkListResult", getTrademarkListResult);
      if (getTrademarkListResult.code == 200) {
        this.trademarkList = getTrademarkListResult.data;
      }
      //   获取平台所有的销售属性 getSpuInfoResult里的只是当前Spu已有的
      let getBaseSaleAttrListResult =
        await this.$API.spu.getBaseSaleAttrListReq();
      console.log("getBaseSaleAttrListResult", getBaseSaleAttrListResult);
      if (getBaseSaleAttrListResult.code == 200) {
        this.platformAllSaleAttrList = getBaseSaleAttrListResult.data;
      }
    },

    // 照片墙图片上传成功的回调
    /*
      如果是新增的SPU既没有id,也没有spuId,只有imgName和imgUrl字段
      如果是修改已有SPU的信息,有spuId
      他是直接
    */
    handleAvatarSuccess(response, file, fileList) {
      console.log(response);
      console.log(fileList);
      if (response.code == 200) {
        this.spuImageList = fileList;
      }
    },
    // 点击照片墙删除按钮,图片移除成功的回调
    /*
      把新的图片列表重新放回spuImageList里
      暂时还没处理里面的字段,也还没放到spuInfo里
    */
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.spuImageList = fileList;
    },
    // 照片墙预览按钮的回调
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 点击 添加销售属性按钮 往销售属性列表添加属性
    selectThisSpuDoNotHaveSaleAttrInfoConfirm() {
      let res = this.selectThisSpuDoNotHaveSaleAttrInfo.split(":");
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId: res[0],
        saleAttrName: res[1],
        spuSaleAttrValueList: [],
      });
      this.selectThisSpuDoNotHaveSaleAttrInfo = "";
    },
    // 点击 tag的x按钮 的回调
    handleClose(spuSaleAttrValueList, index) {
      spuSaleAttrValueList.splice(index, 1);
    },
    // 点击 添加新属性值按钮 的回调
    showInput(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    // 输入框失焦的回调
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue, spuSaleAttrValueList } = row;
      if (inputValue.trim() == "") {
        this.$message.error("属性值不能为空");
      } else {
        let isRepeat = spuSaleAttrValueList.some((item) => {
          return item.saleAttrValueName == inputValue;
        });
        if (isRepeat) {
          this.$message.warning("该属性值已存在");
        } else {
          spuSaleAttrValueList.push({
            baseSaleAttrId,
            saleAttrValueName: inputValue,
          });
          this.$message.success("添加属性值成功");
        }
      }
      row.inputVisible = false;
      delete row.inputVisible;
      delete row.inputValue;
    },
    // 移除销售属性
    deleteSpuSaleAttr(index){
      this.spuInfo.spuSaleAttrList.splice(index, 1)
    },
    // 保存按钮
    async addOrUpdateSpuConfirm() {
       this.spuImageList.forEach((item) => {
        if (item.response && item.response.code == 200) {
            item.imgName=item.name,
            item.imgUrl=item.response.data
        }
      });
      
      this.spuInfo.spuImageList = this.spuImageList
      let res = await this.$API.spu.addOrUpdateSpuInfoReq(this.spuInfo)
      if(res.code == 200){
        this.$emit("editSwitchToShowTable", {screen:1, type: this.spuInfo.id ? 'update' : 'add'});
      }
    },
    // 取消按钮,切换回展示区的回调
    switchToShowTbale() {
      this.$emit("editSwitchToShowTable", {screen:1, type: this.spuInfo.id ? 'update' : 'add'});
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

照片墙
:file-list="spuImageList" 照片墙文件列表 图片对象数组 对象的字段要求 name和url
照片墙elementui要的字段为name和url
他就直接往请求回来的数据身上添加了这两个字段而已
删除图片得到的新数组赋值给spuImageList,这时还是有name和url字段的
上传成功后可以拿着upload的成功的回调暂时展示数据,但当点击保存按钮的时候还要处理数据
预览

下拉框
过滤未选中的销售属性
 return(true的item) platformAllSaleAttrList.fliter(item=>{
  return(true/false) spuInfo.spuSaleAttrList.every(item2=>{
     return(true/false) item2.saleAttrName != item.name
  })
})
尝试用两个for循环做做

还有一点下拉框选中的id收集到哪？单独拎出来还是写到spuInfo里
先单独拎出来点击按钮在push进去

下拉框选中后要收集saleAttrName和id,这两个值在unSelectedSaleAttrList里
收集到selectThisSpuDoNotHaveSaleAttrInfo里
点击按钮时才往spuInfo里push

销售属性值列表
点击添加按钮的时候往当前行里添加两个响应式的字段inputVisble和inputValue
失焦了往当前行的
数据收集到spuSaleAttrValueList里 baseSaleAttrId  saleAttrValueName
spuSaleAttrValueList[
  {
    baseSaleAttrId
    saleAttrValueName
  }
]

清除数据Object.assign(this._data,this.$options.data())
