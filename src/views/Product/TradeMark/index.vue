<template>
  <div id="trademark">
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 20px"
      @click="addTradeMark"
      >添加</el-button
    >
    <!-- 
      :data 接收table要用到的表格,字段是组件的props规定好的
      border 表格边框
      type index expand selection
      label 表头文本类容
      align 表格对齐方式
      header-align 表头对齐方式
      prop 每一个el-table-column,遍历data中的数据,渲染一列,prop指定表格的文本内容显示数据字段的内容
      有多少个el-table-colum就渲染多少列, 每一个el-table-colum渲染多少行就看你传的数组有多少条数据了
      <template slot-scope="scope">
          {{scope.row}}
      </template>
      能拿到el-table-column渲染的每一行时回传的当前行的数据,这里的row和$index字段都是组件规定好的,模糊的回去看看P121
     -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        align="center"
      ></el-table-column>
      <el-table-column label="品牌LOGO" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="height: 100px; width: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMarkById(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMaekById(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 
      给dialog动态绑定title
      dialog关闭重置表单校验结果
      :rules 表单验证, 绑定的rules是验证的规则
      status-icon 验证通过与不通过的icon图标
      prop指定校验规则 值为rules里的key
      action 是el-upload上传的目标
      show-file-list 默认为true,这个属性是照片墙用的
      on-success 上传成功的回调
      before-upload 上传之前的回调
     -->
    <el-dialog
      :title="addOrUpdateTradeMarkInfoForm.id ? '修改品牌信息' : '新增品牌'"
      :visible.sync="addOrUpdateTradeMarkInfoFormDialogVisible"
      width="40%"
      @close="closeDialog"
    >
      <el-form
        :model="addOrUpdateTradeMarkInfoForm"
        label-width="100px"
        style="width: 80%"
        :rules="rules"
        ref="addOrUpdateTradeMarkInfoForm"
        status-icon
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input
            v-model="addOrUpdateTradeMarkInfoForm.tmName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="addOrUpdateTradeMarkInfoForm.logoUrl"
              :src="addOrUpdateTradeMarkInfoForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateTradeMarkInfoFormDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="addOrUpdateTradeMarkInfoConfirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 
      layout 分页器的布局 -> 让它后面的跑到最右边
      pager-count 带有数字的按钮的个数
     -->
    <el-pagination
      style="text-align: center; margin-top: 20px"
      layout="prev, pager, next, jumper,->,sizes,total"
      :pager-count="7"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 7]"
      :total="total"
      @current-change="getTradeMarkList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  mounted() {
    this.getTradeMarkList();
  },
  data() {
    var validateTmNameLength = (rule, value, callback) => {
      if (value.length < 2 || value.length > 8) {
        callback(new Error("长度在 3 到 8 个字符"));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      limit: 5,
      data: [],
      total: 99,
      addOrUpdateTradeMarkInfoFormDialogVisible: false,
      addOrUpdateTradeMarkInfoForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
          { validator: validateTmNameLength, trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请选择品牌LOGO" }],
      },
    };
  },
  methods: {
    async getTradeMarkList(page = 1) {
      this.page = page;
      let res = await this.$API.trademark.getTradeMarkListReq(
        this.page,
        this.limit
      );
      if (res.code == 200) {
        this.page = res.data.current;
        this.data = res.data.records;
        this.total = res.data.total;
      }
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getTradeMarkList();
    },
    // 打开添加品牌对话框
    addTradeMark() {
      this.addOrUpdateTradeMarkInfoForm = {
        tmName: "",
        logoUrl: "",
      };
      this.addOrUpdateTradeMarkInfoFormDialogVisible = true;
    },
    // 打开更新品牌信息对话框
    updateTradeMarkById(row) {
      // row是表格的数据,addOrUpdateTradeMarkInfoForm是dialog用的数据
      // 直接赋值是赋值的对象的地址
      // 修改addOrUpdateTradeMarkInfoForm的数据,也会修改row的数据
      // 用展开运算符实现浅拷贝,达到修改addOrUpdateTradeMarkInfoForm的数据不会修改row的数据的效果
      this.addOrUpdateTradeMarkInfoForm = { ...row };
      this.addOrUpdateTradeMarkInfoFormDialogVisible = true;
    },
    // 关闭对话框,重置验证结果
    closeDialog() {
      this.$refs.addOrUpdateTradeMarkInfoForm.clearValidate();
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.addOrUpdateTradeMarkInfoForm.logoUrl = res.data;
      }
    },
    // 图片验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加或更新品牌信息
    addOrUpdateTradeMarkInfoConfirm() {
      this.$refs.addOrUpdateTradeMarkInfoForm.validate(async (valid) => {
        if (valid) {
          let res = await this.$API.trademark.addOrUpdateTradeMarkInfoReq(
            this.addOrUpdateTradeMarkInfoForm
          );

          if (res.code == 200) {
            this.addOrUpdateTradeMarkInfoFormDialogVisible = false;
            this.$message.success({
              message: this.addOrUpdateTradeMarkInfoForm.id
                ? "修改品牌信息成功"
                : "添加品牌成功",
            });

            // let pageNo = Math.ceil(this.total / this.limit)
            // if(this.total % this.limit == 0) {
            //   pageNo = this.total / this.limit + 1
            // }

            this.addOrUpdateTradeMarkInfoForm.id
              ? this.getTradeMarkList(this.page)
              : this.getTradeMarkList();
          } else {
            this.$message.error(res.message);
          }
        }
      });
    },
    // 删除品牌信息
    async deleteTradeMaekById(row) {
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$API.trademark.deleteTradeMarkByIdReq(row.id);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTradeMarkList(this.data.length < 2 ? this.page - 1 : this.page);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>