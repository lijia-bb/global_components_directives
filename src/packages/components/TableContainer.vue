<template>
  <div>
    <!-- 顶部按钮部分 -->
    <div class="Top">
      <div v-if="TopBtu" class="top_btu">
        <el-button
          v-for="(item, index) in TopBtu"
          :key="index"
          :type="item.type"
          :icon="item.icon"
          size="small"
          @click="cast(item.incident)"
          >{{ item.label }}</el-button
        >
      </div>

      <!-- 搜索框部分 -->
      <div class="searchK" v-if="searchK">
        <el-form :model="searchform" ref="searchform" label-width="100px">
          <div class="searchinput">
            <el-form-item
              v-for="(item, index) in searchK"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              label-width="150px"
            >
              <el-input
                v-if="item.type === 'number' || item.type === 'text'"
                :type="item.type"
                :placeholder="'请输入要搜索的' + item.label"
                v-model="searchform[item.prop]"
                clearable
                style="width: 220px"
              ></el-input>
              <el-select
                v-if="item.type === 'select'"
                :placeholder="'请输入' + item.label"
                v-model="searchform[item.prop]"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <!--搜索框按钮部分-->
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-search"
                item
                @click="submitForm(searchform)"
                >查询</el-button
              >
              <el-button
                icon="el-icon-refresh-right"
                type="info"
                size="small"
                @click="resetForm(searchform)"
                >重置</el-button
              >
              <!--列配置按钮部分-->
              <el-button
                type="primary"
                class="el-icon-menu"
                @click="lieconfig"
                v-if="this.lieconfigshow == false"
                size="small"
                >列配置</el-button
              >
              <div
                style="display: inline-block; margin-left: 30px"
                v-show="this.lieconfigshow == true"
              >
                排序<el-switch
                  v-model="issortable"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="true"
                  :inactive-value="false"
                ></el-switch>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="查询"
                  placement="top"
                >
                  <i
                    class="el-icon-search"
                    @click="submitForm"
                    style="font-size: 25px; color: DodgerBlue"
                  ></i>
                </el-tooltip>
                <!--列配置设置按钮部分-->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="设置"
                  placement="top"
                >
                  <el-popover placement="top" width="300" v-model="visible">
                    <div>
                      <el-checkbox
                        :indeterminate="isIndeterminate"
                        v-model="checkAll"
                        :checked="true"
                        @change="handleCheckAllChange"
                        >列配置</el-checkbox
                      >
                      <el-button
                        type="text"
                        style="margin-left: 80px; color: red"
                        @click="reset"
                        >重置</el-button
                      >
                      <el-row v-for="(item, index) in tableProp" :key="index">
                        <el-col :span="12">
                          <el-checkbox-group
                            v-model="selecttable"
                            @change="handleCheckedChange"
                          >
                            <el-checkbox
                              style="margin-top: 15px"
                              :label="item"
                              :key="index"
                              :checked="true"
                              >{{ item.name }}</el-checkbox
                            >
                          </el-checkbox-group>
                        </el-col>
                        <el-col :span="12">
                          <span>表格宽度 </span>
                          <el-input
                            v-model="item.width"
                            style="width: 60px; margin-top: 5px"
                          ></el-input>
                          <span>px</span>
                        </el-col>
                      </el-row>
                    </div>
                    <i
                      class="el-icon-setting"
                      slot="reference"
                      style="font-size: 25px; color: DodgerBlue"
                    ></i>
                  </el-popover>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="重置"
                  placement="top"
                >
                  <i
                    class="el-icon-refresh"
                    style="font-size: 25px; color: DodgerBlue"
                    @click="mainreset"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="普通查询"
                  placement="top"
                >
                  <i
                    class="el-icon-d-arrow-left"
                    @click="lieconfig"
                    style="font-size: 25px; color: DodgerBlue"
                  ></i>
                </el-tooltip>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <!-- 表格部分 -->
      <div class="tableT">
        <!-- "tableData"//表格数据  -->
        <!--  "tableConfig.border"//表格边框-->
        <!-- "{ prop: 'id', order: 'descending' }"//表格默认排列方式 -->
        <el-table
          :data="tableData"
          @select="danxuan"
          @select-all="quanxuan"
          :border="tableConfig.border"
          style="width: 100%"
          :default-sort="{ prop: 'id', order: 'descending' }"
        >
          <!--表格中的多行选择框-->
          <el-table-column
            v-if="tableConfig.selection"
            type="selection"
            width="55"
            align="center"
          >
          </el-table-column>
          <el-table-column
            fixed
            v-if="tableConfig.index"
            type="index"
            label="序号"
            align="center"
            width="50"
          >
          </el-table-column>

          <!--表格中的图像类型-->
          <el-table-column
            v-for="(item, index) in selecttable"
            v-show="item.prop == 'avatar' || item.prop == 'preimg'"
            :key="index"
            :prop="item.prop"
            :label="item.name"
            :width="item.width"
            align="center"
          >
            <template slot-scope="scope">
              <img
                v-if="scope.row[item.prop]"
                :src="scope.row[item.prop]"
                min-width="70"
                height="70"
              />
              <el-tag v-else type="primary" disable-transitions>无图片</el-tag>
            </template>
          </el-table-column>
          <!-- :prop="item.prop"//表格值
            :label="item.name"//表格名
            :width="item.width"//表格宽度
            :show-overflow-tooltip="true"//是否展示文字提示
            :formatter="item.formatter || undefined"//表格格式化
            align="center"
            :sortable="issortable"//是否可排序 -->
          <el-table-column
            v-for="(item, index) in selecttable"
            v-show="item.prop !== 'avatar' && item.prop !== 'preimg'"
            :key="index"
            :prop="item.prop"
            :label="item.name"
            :width="item.width"
            :show-overflow-tooltip="true"
            :formatter="item.formatter || undefined"
            align="center"
            :sortable="issortable"
          >
          </el-table-column>

          <!--表格内最右边操作列-->
          <el-table-column
            v-if="tableConfig.handle"
            fixed="right"
            label="操作"
            align="center"
            :min-width="210"
          >
            <template slot-scope="scope">
              <!--操作列内的按钮部分-->
              <el-button
                v-for="(item, index) in tableConfig.buttonAffairs"
                :key="index"
                @click="handleClick(item.affairs, scope.row)"
                :type="item.type"
                size="mini"
                >{{ item.name }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="block">
        <el-pagination
          v-if="tableConfig.pagin"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.page"
          :page-sizes="[5, 10, 50, 100]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tabletotal"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableContainer',
  props: {
    TopBtu: Array, //顶部按钮接收值
    searchK: Array, //搜索框接收值
    tableProp: Array, //表格字段接收值
    tableData: Array, //表格内显示的数据
    tabletotal: () => 0, //表格内数量接收值
    //分页对象
    page: {
      page: Number,
      pageSize: Number
    },
    tableConfig: {
      //表格配置
      type: Object,
      default: function() {
        return {
          pagin: true, //是否分页
          selection: true, // 选择框
          index: true, // 序号
          border: true, // 边框
          handle: true, // 是否显示操作列
          buttonAffairs: [
            //操作列内按钮
            {
              name: '编辑',
              icon: 'el-icon-plus',
              type: 'primary',
              affairs: 'Edit'
            },
            {
              name: '删除',
              icon: 'el-icon-delete',
              type: 'danger',
              affairs: 'Remove'
            }
          ]
        }
      }
    }
  },
  data() {
    return {
      lieconfigshow: false,
      issortable: true,
      visible: false,
      checkAll: false,
      isIndeterminate: false,
      selecttable: [],
      //表单对象
      searchform: {},
      //批量删除数组
      batchdel: []
    }
  },
  methods: {
    cast(val) {
      //顶部按钮抛出事件
      if (val === 'Remove') {
        this.$emit('simTop' + val, this.batchdel)
        return
      }
      this.$emit('simTop' + val)
    },

    //列配置
    lieconfig() {
      this.lieconfigshow = !this.lieconfigshow
    },
    handleCheckAllChange(val) {
      this.selecttable = val ? this.tableProp : []
      this.isIndeterminate = false
    },
    handleCheckedChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.tableProp.length //选中长度等于总长度时全选按钮为true
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.tableProp.length
    },

    reset() {
      //列配置内设置的重置按钮
      this.tableProp = this.$options.propsData.tableProp
      this.selecttable = this.tableProp
      this.isIndeterminate = false
      this.checkAll = true
    },
    mainreset() {
      //重置按钮抛出事件
      this.searchform = {}
      this.$emit('reset')
    },
    submitForm(searchform) {
      //查询抛出事件
      this.$emit('selCX', searchform)
    },
    resetForm(searchform) {
      console.log(searchform)
      //重置按钮抛出事件
      this.searchform = {}
      this.$emit('reset')
    },
    handleClick(affairs, row) {
      //表格内操作列抛出事件
      this.$emit('sim' + affairs, row)
    },
    danxuan(selection) {
      //表格多选
      this.batchdel = selection
    },
    quanxuan(selection) {
      //表格多选
      this.batchdel = selection
    },
    handleSizeChange(val) {
      //分页每页大小改变操作事件
      this.page.pageSize = val
      this.$emit('getlist', this.page)
    },
    handleCurrentChange(val) {
      //分页当前页改变操作事件
      this.page.page = val
      this.$emit('getlist', this.page)
    }
  }
}
</script>

<style scoped>
.searchinput {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
}
.el-table thead {
  background-color: aqua;
}
.block {
  margin-top: 20px;
  text-align: right;
}
</style>
