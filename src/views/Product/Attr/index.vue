<template>
  <div id="attr">
    <Selector @selectIdComplate="selectIdComplateHandler" :isSelectable="!isShowTable"></Selector>
    <el-card>
      <!-- 展示区域 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 0 0 10px 0"
          @click="addAttrSwitchToEditArea"
          :disabled="attrInfoList.length == 0"
          >添加属性</el-button
        >
        <!-- :data="data" -->
        <el-table :data="attrInfoList" style="width: 100%" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- {{row.attrValueList}} -->
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                @click="changeAttrSwitchToEditArea(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定删除${row.attrName}吗？`"
                @onConfirm="deleteAttrConfirm(row.id)"
                style="margin: 0 0 0 10px"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                ></el-button>
              </el-popconfirm> 
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 编辑区域 -->
      <div v-show="!isShowTable">
        <!-- 
          :model="addOrUpdateAttrInfoParamsObj"不写
          直接v-model="addOrUpdateAttrInfoParamsObj.attrName也能收集数据
          这和收集数据没有太大的关系
          但要用表单的rules验证的时候就有用了,不写model拿不到对象里面的字段，无法验证的
        -->
        <el-form
          :inline="true"
          :model="addOrUpdateAttrInfoParamsObj"
          class="demo-form-inline"
        >
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="addOrUpdateAttrInfoParamsObj.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="addOrUpdateAttrInfoParamsObj.attrName == ''"
          @click="addAttrValue"
          ref="addAttrValueBtn"
          >添加属性值</el-button
        >
        <el-table
          style="width: 100%; margin: 10px 0"
          border
          :data="addOrUpdateAttrInfoParamsObj.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值"
                v-if="row.isShowInput"
                @blur="attrValueInputComplate(row, $index)"
                @keyup.enter.native="attrValueInputComplate(row, $index)"
                :ref="`input-${$index}`"
              ></el-input>
              <p v-else @click="changeAttrValue(row, $index)">
                {{ row.valueName }}
              </p>
            </template></el-table-column
          >
          <el-table-column prop="prop" label="操作" width="width"
            ><template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValueConfirm($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                ></el-button>
              </el-popconfirm> </template
          ></el-table-column>
        </el-table>
        <el-button
          type="primary"
          :disabled="addOrUpdateAttrInfoParamsObj.attrValueList.length == 0"
          @click="addOrUpdateAttrListConfirm"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      selectedIdObj: {},
      // 平台的属性和属性值列表
      attrInfoList: [],
      // 切换显示表格和编辑区域
      isShowTable: true,
      // 创建和更新属性和属性值列表的对象
      addOrUpdateAttrInfoParamsObj: {
        // 属性名
        attrName: "",
        // 属性值列表
        attrValueList: [],
        categoryId: undefined,
        categoryLevel: 3,
        id: undefined
      },
      // 点击p标签变为输入框时,保存原来的属性值
      originAttrValueName: "",
    };
  },
  methods: {
    // 接收子组件Selector传递过来的数据
    selectIdComplateHandler(selectedIdObj) {
      this.selectedIdObj = selectedIdObj;
      this.getAttrInfoList()
    },
    // 获取属性值列表数据
    async getAttrInfoList() {
      const { selectedCategory1Id, selectedCategory2Id, selectedCategory3Id } =
        this.selectedIdObj;
      let res = await this.$API.attr.getAttrInfoListReq(
        selectedCategory1Id,
        selectedCategory2Id,
        selectedCategory3Id
      );
      if (res.code == 200) {
        this.attrInfoList = res.data;
      }
    },
    // 确认删除属性的回调
   async deleteAttrConfirm(attrId){
      let res = await this.$API.attr.deleteAttrReq(attrId)
      // console.log(res);
      if(res.code == 200){
        this.getAttrInfoList()
        this.$message.success('删除属性成功')
      }
    },
    // 点击添加属性按钮切换到编辑区域
    addAttrSwitchToEditArea() {
      this.isShowTable = false;
      this.addOrUpdateAttrInfoParamsObj = {
        attrName: "",
        attrValueList: [],
        categoryId: this.selectedIdObj.selectedCategory3Id,
        categoryLevel: 3,
        id: undefined
      };
    },
    // 点击修改切换到编辑区域
    changeAttrSwitchToEditArea(row) {
      this.isShowTable = false;
      row.attrValueList.forEach((attrValue) => {
        this.$set(attrValue, "isShowInput", false);
      });
      this.addOrUpdateAttrInfoParamsObj = cloneDeep(row);
      console.log(this.addOrUpdateAttrInfoParamsObj);
    },
    // 点击添加属性值按钮的回调
    addAttrValue() {
      // 往数组里添加一个新的对象
      this.addOrUpdateAttrInfoParamsObj.attrValueList.push({
        // 属性值ID
        attrId: this.addOrUpdateAttrInfoParamsObj.id,
        // 属性值
        valueName: "",
        // 每一行都有单独的一个isShowInput控制显示与隐藏输入框
        isShowInput: true,
      });

      // 就算是template的结构用v-show也是一样的,数组里的数据push之后才有结构
      this.$nextTick(() => {
        this.$refs[
          `input-${this.addOrUpdateAttrInfoParamsObj.attrValueList.length - 1}`
        ].focus();
      });
    },
    // 点击table表格里的p标签改变属性值的回调
    changeAttrValue(row, index) {
      row.isShowInput = true;
      this.originAttrValueName = row.valueName;
      this.$nextTick(() => {
        this.$refs[`input-${index}`].focus();
      });
    },
    // 输入完成,输入框失去焦点的回调
    attrValueInputComplate(row, index) {
      // 输入值为空的处理
      // if (row.valueName.trim() == "") {
      //   // input框已经被销毁了,拿不到
      //   // this.$nextTick(() => {
      //   //   this.$refs[`input-${index}`].focus();
      //   // });
      //   // 让输入框持续聚焦,程序就跑不下去了
      //   // return this.$refs[`input-${index}`].focus();
      //   if (this.originAttrValueName != "") {
      //     row.valueName = this.originAttrValueName;
      //     this.$message.warning(
      //       `输入值不能为空,已恢复到初始值${this.originAttrValueName}`
      //     );
      //   } else {
      //     this.addOrUpdateAttrInfoParamsObj.attrValueList.pop();
      //     this.$message.error("输入值不能为空");
      //   }
      //   row.isShowInput = false;
      //   return;
      // }

      // console.log('index-',index);
      // console.log('length-',this.addOrUpdateAttrInfoParamsObj.attrValueList.length);
      let isEndOfattrValueListChanging =
        index == this.addOrUpdateAttrInfoParamsObj.attrValueList.length - 1;
      // 判断修改的是否为数组的最有一位
      if (isEndOfattrValueListChanging) {
        // 尾部添加的做法
        if (row.valueName.trim() == "") {
          this.addOrUpdateAttrInfoParamsObj.attrValueList.pop();
          this.$message.error("输入值不能为空");
          return (row.isShowInput = false);
        }
        // 遍历数组（除了最后一项，最有一项为添加的元素）,查看是否有重复
        let isRepeated = this.addOrUpdateAttrInfoParamsObj.attrValueList.some(
          (attrValue) => {
            if (attrValue != row) {
              return attrValue.valueName == row.valueName;
            }
          }
        );
        if (isRepeated) {
          this.$message.warning("该属性值已经存在");
          // 有重复,input不隐藏,不失焦,这样写有BUG
          // return this.$refs[
          //   `input-${
          //     this.addOrUpdateAttrInfoParamsObj.attrValueList.length - 1
          //   }`
          // ].focus();
          // 换一种写法,有重复的直接失焦
          this.addOrUpdateAttrInfoParamsObj.attrValueList.pop();
        } else {
          row.isShowInput = false;
        }
      } else {
        // 不是尾部添加（修改已有数据）的做法
        if (row.valueName.trim() == "") {
          row.valueName = this.originAttrValueName;
          this.$message.warning(
            `输入值不能为空,已恢复到初始值${this.originAttrValueName}`
          );
        }
        let count = 0;
        this.addOrUpdateAttrInfoParamsObj.attrValueList.forEach((attrValue) => {
          if (attrValue.valueName == row.valueName) {
            count++;
          }
        });
        if (count >= 2) {
          this.$message.warning(
            `该属性值已经存在,修改为原来的值：${this.originAttrValueName}`
          );
          row.valueName = this.originAttrValueName;
        }
        row.isShowInput = false;
      }

      // 输入框隐藏的写法
      // if(isRepeated){
      //   this.$message.warning('该属性值已经存在')
      //   this.addOrUpdateAttrInfoParamsObj.attrValueList.pop()
      // }
    },
    // 确认删除属性值
    deleteAttrValueConfirm(index) {
      this.addOrUpdateAttrInfoParamsObj.attrValueList.splice(index, 1);
    },
    // 发请求保存对属性、属性值的修改
    async addOrUpdateAttrListConfirm() {
      this.addOrUpdateAttrInfoParamsObj.attrValueList.forEach((attrValue) => {
        delete attrValue.isShowInput;
      });
      // console.log(this.addOrUpdateAttrInfoParamsObj);
      let res = await this.$API.attr.saveAttrInfoReq(
        this.addOrUpdateAttrInfoParamsObj
      );
      if (res.code == 200) {
        this.isShowTable = true;
        this.getAttrInfoList();
      }
    },
  },
};
</script>

<style>
</style>


菜单拆成一个组件
一上来获取一次菜单数据,渲染

选择一级菜单（一级菜单发送变化）后:
二级、三级的数组数据和选择中的ID都置空 获取二级菜单渲染 
数组不清空,不然二级菜单的下拉列博鳌的数据是新的了,但三级菜单的有残留,(二级菜单的数组可以不清空,新的会覆盖,但三级菜单必须清空)
ID不置空, 下拉框的下拉列表是变了,但选择框有残留,(ID是二级三级都必须要清空)

选择二级菜单获取三级菜单,渲染

选择三级菜单后,把三级ID都传给父组件,在父组件发送请求(在子组件获取数据给父组件传过去也行)
GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
那你又说在一二三级分类选择后都触发自定义事件给父组件传ID,
还又传一个level属性给父组件判断,父组件根据level不同,给父组件的一二三级ID赋值

card里的第一个div v-show = isShow
button 没有三级分类ID禁用
table
序号 属性名称 属性值列表（tag v-for） 操作（button 修改、删除）

card的第二个div v-show = !isShow
属性名 inline-form input
button 添加属性值 取消
table
序号 属性值名称 操作（）
button 保存 取消

添加属性
POST /admin/product/saveAttrInfo
data:{
  "attrName": "string",       属性名
  "attrValueList": [          属性值列表
    {
      "attrId": 0,            属性值ID              
      "valueName": "string"   属性值
    }
  ],
  "categoryId": 0,            category3Id  这里收集ID,不能用categoryId:this.category3Id的这种写法,同是data里的数据拿不到的。
  "categoryLevel": 3,
}

属性值的收集
他收集的方式: 一上来table表格就绑定addOrUpdateAttrInfoParamsObj里的attrValueList
然后就传input结构进去了 input双向绑定row.valueName
然后又把attrValueList手动清空了
点击添加属性值按钮往attrValueList里面push一个对象{attrId:addOrUpdateAttrInfoParamsObj.id, valueName: }  
这你妈的讲的是什么东西啊？修改的时候要带上上面的ID,添加为undefined
你他妈的又回去说点击添加属性按钮,点击时收集categoryId,addOrUpdateAttrInfoParamsObj其他的数据置空

修改 把row赋值给addOrUpdateAttrInfoParamsObj,用lodash深拷贝:cloneDeep
给attrValueList的数据添加flag字段
直接添加数据不是响应式的
用this.$set(对象，字段，值)

input和span切换显示
给row里添加flag切换
切换的时候判断是否为空，为空,falg不切换回span
去重，去重的时候刨除自己
他的做法是some遍历attrValueList里的每一个数据
item !== row 先刨除自己
返回 row.valueName == item.valueName 
只要有重复的,some的返回值就为真。为真以后就中断函数,不让flag改为false
去重不能在push的时候做,因为他是push之后才会出现输入框
做得是真垃圾啊
还有就是,如果要修改的不是最后一项,会不会出问题

input 自动聚焦
给input打ref = $index
切换为编辑模式拿$index
这里用到了v-if 和 v-else,会导致DOM创建和删除,会拿不到$index
用$nextTick

删除 从attrValueList剔除

保存 剔除flag字段,他这里的input为空也能继续点击添加的按钮


选择三级菜单后展示属性列表 （完成）
展示和编辑的两个区域之间的切换 （完成）
添加的切换清空数据 （完成）
编辑区域按钮的disable
添加属性值按钮：有属性名才能按（完成）
保存按钮：属性值列表非空才能按（完成）



{
  "attrName": "string",
  "attrValueList": [
    {
      "attrId": 0,
      "id": 0,
      "valueName": "string"
    }
  ],
  "categoryId": 0,
  "categoryLevel": 0,
  "id": 0
}