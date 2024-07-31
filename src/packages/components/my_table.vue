<template>
  <div>
    <el-table
      ref="commonTable"
      :data="tableData"
      :height="tableHeight"
      v-loading="loading"
      border
      :style="{
        width: '100%',
        borderBottom: maxHeight === 'auto' ? 'none' : '1px solid #DCDFE6',
      }"
      :max-height="maxHeight"
      :row-class-name="tabRowClassName"
      :row-style="rowStyle"
      :cell-class-name="cellClassName"
      header-row-class-name="custom-table-header"
      :row-key="keyId"
      @select="handleSelectionChange"
      @select-all="handleSelectionChange"
      @sort-change="sortChange"
    >
      <!-- 单选框 -->
      <el-table-column
        v-if="showCheckBox"
        key="showCheckBox"
        width="55"
        type="selection"
        :reserve-selection="keep"
        :class-name="turnRadio ? `checkBoxRadio` : ``"
        align="center"
      />
      <!-- 展开 -->
      <el-table-column v-if="showExpand" key="showExpand" type="expand">
        <template slot-scope="{ row }">
          <slot name="expand" :row="row" />
        </template>
      </el-table-column>
      <!-- 序号 -->
      <el-table-column v-if="showIndex" align="center" label="序号" width="50">
        <template slot-scope="{ $index }">{{ $index + 1 }}</template>
      </el-table-column>
      <!-- 表格 -->
      <el-table-column
        v-for="(item,idx) in tableLabel.filter((item) => item.label)"
        :key="item[keyId]"
        :width="item.width ? item.width : ''"
        :min-width="item.minWidth ? item.minWidth : ''"
        :align="!!item.align ? item.align : 'center'"
        :label="item.label"
        :sortable="item.sortable ? item.sortable : false"
        :sortOrders="item.sortOrders ? item.sortOrders : []"
        :show-overflow-tooltip="overflowText"
        :fixed="item.fixed"
        :prop="item.prop"
      >
        <template slot-scope="{ row }">
          <template v-if="item.Image">
            <div>
              <el-image
                class="table-img"
                :src="row.attachment"
                :preview-src-list="[row.attachment]"
              >
                <template slot="error">
                  <span>无</span>
                </template>
              </el-image>
            </div>
          </template>

          <!--进度条-->
          <template v-else-if="item.progress">
            <el-progress
              class="progress-line"
              :text-inside="true"
              :stroke-width="26"
              :percentage="row[item.prop]"
            />
          </template>

          <template v-else-if="item.render">
              <!-- <div
                style="cursor: pointer"
                @click="!!item.methods && handleClickon(item.methods, row)"
                v-html="item.render(row)"
              /> -->
              <expand-dom :column="item" :row="row" :render="item.render" :index="idx"></expand-dom>
          </template>

          <template v-else>
            <div
              class="text-no-wrap"
              @click="!!item.methods && handleClickon(item.methods, row)"
            >
              {{
                Object.prototype.toString.call(item.prop) == "[object Array]"
                  ? propFilter(item.prop, row)
                  : row[item.prop] || row[item.prop] === 0
                  ? row[item.prop]
                  : "--"
              }}
            </div>
          </template>
        </template>
      </el-table-column>
      <!-- 操作菜单 -->
      <el-table-column
        v-if="!!option"
        :width="option.width"
        :label="option.label"
        :fixed="option.fixed"
        align="center"
      >
        <div v-if="!!option.children" slot-scope="{ row }" class="flex-box">
          <div
            v-for="(item, index) in option.children.filter((item) =>
              item.render ? item.render(row) : true
            )"
            :key="index"
          >
            <el-tooltip
              v-if="!item.type"
              v-permission="{ permission: item.permission }"
              class="item"
              effect="light"
              :popper-class="item.popperClass || 'default-tooltip-primary'"
              :content="item.label"
              placement="top"
            >
              <i
                :class="['default-tooltip-icon', item.icon]"
                :plain="true"
                @click="handleTableButton(row, item.methods)"
              />
            </el-tooltip>
            <el-dropdown
              v-if="item.type === 'drop'"
              v-permission="{ permission: item.permission }"
              class="item"
              @command="
                (command) => {
                  handleTableButton(row, command);
                }
              "
            >
              <span class="el-dropdown-link">
                <i :class="['default-tooltip-icon', item.icon]" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="itm in item.children.filter((itm_child) =>
                    itm_child.render ? itm_child.render(row) : true
                  )"
                  :key="itm.methods"
                  v-permission="{ permission: itm.permission }"
                  :command="itm.methods"
                >
                  <i
                    v-if="itm.icon"
                    :class="['default-tooltip-icon', itm.icon]"
                    :plain="true"
                  />
                  {{ itm.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        v-if="showPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageObj.page"
        :page-sizes="pageSizes"
        :page-size="pageObj.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tabletotal"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommonTable",
  props: {
    /**
     * 表格最高高度
     */
    tableHeight: {
      type: [String, Number],
      default: "400",
    },
    /**
     * 表格最高高度
     */
    maxHeight: {
      type: [String, Number],
      default: "auto",
    },
    /**
     * 表格自定义属性展示
     */
    tableLabel: {
      type: Array,
      default: () => {
        return [];
      },
    },
    /**
     * 表格数据源
     */
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    /**
     * 配置需要显示的操作菜单
     */
    option: {
      type: Object,
      default: () => {},
    },
    showCheckBox: {
      // 配置是否显示全选（复选框）
      type: Boolean,
      default: false,
    },
    /**
     * 是否显示索引
     */
    showIndex: {
      type: Boolean,
      default: false,
    },
    turnRadio: {
      type: Boolean,
      default: false,
    },
    selectedIdArr: {
      type: Array,
      default: () => [],
    },
    /**
     * 是否 隐藏文字过长
     */
    overflowText: {
      type: Boolean,
      default: false,
    },
    /**
     * 加载提示
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否保持之前复选框的数据
     */
    keep: {
      type: Boolean,
      default: false,
    },
    /**
     * 动态绑定 key 值
     */
    keyId: {
      type: String,
      default: "id",
    },
    /**
     * 行内自定义样式配置
     */
    rowStyle: {
      type: Object,
      default: () => {
        return {
          height: "28px",
        };
      },
    },
    /**
     * 是否展示展开按钮
     */
    showExpand: {
      type: Boolean,
      default: false,
    },
    /**
     * 行内自定义class
     */
    rowClassName: {
      type: Function,
      default: () => {
        return () => {};
      },
    },
    /**
     * 是否显示分页
     */
    showPage: {
      type: Boolean,
      default: false,
    },
    /**
     * 分页对象
     */
    pageObj: {
      type: Object,
      default: () => ({
        page: 1,
        pageSize: 10,
      }),
    },
    /**
     * 每页条数
     */
    pageSizes: {
      tyep: Array,
      default: () => [10, 50, 100, 500],
    },
    /**
     * 总条数
     */
    tabletotal: {
      tyep: Number,
      default: 0,
    },
  },
   //组件
  components: {
    expandDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, ctx) => {
        debugger
        const params = {
          row: ctx.props.row,
          index: ctx.props.index
        }
        debugger
        if (ctx.props.column) params.column = ctx.props.column
        return ctx.props.render(h, params)
      }
    },
  },
  data() {
    return {
      curPageCheck: [],
      radioId: "",
      showVertical: false,
    };
  },
  watch: {
    tableData: {
      handler() {
        if (this.showCheckBox || this.turnRadio) {
          this.$nextTick(() => {
            this.$refs.commonTable.clearSelection();
            this.curPageCheck = [];
            if (this.showCheckBox && this.turnRadio) {
              this.tableData.filter((item) => {
                if (item.id === this.selectedIdArr[0]) {
                  this.$refs.commonTable.toggleRowSelection(item, true);
                }
              });
            } else if (this.showCheckBox) {
              this.tableData.filter((item) => {
                if (this.selectedIdArr.includes(item.id)) {
                  this.$refs.commonTable.toggleRowSelection(item, true);
                  this.curPageCheck.push(item.id);
                }
              });
            }
          });
        }
      },
      deep: true,
      immediate: true,
    },
    selectedIdArr: {
      handler(val) {
        if (this.showCheckBox || this.turnRadio) {
          this.$nextTick(() => {
            this.$refs.commonTable.clearSelection();
            this.curPageCheck = [];
            if (this.showCheckBox && this.turnRadio) {
              this.tableData.filter((item) => {
                if (item.id === val[0]) {
                  this.$refs.commonTable.toggleRowSelection(item, true);
                }
              });
            } else if (this.showCheckBox) {
              this.tableData.filter((item) => {
                if (val.includes(item.id)) {
                  this.$refs.commonTable.toggleRowSelection(item, true);
                  this.curPageCheck.push(item.id);
                }
              });
            }
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /**
     * prop 单值 或者 数组过滤(此处为针对时间组，不作为通用处理)
     */
    propFilter(prop, row) {
      const res = prop.reduce((total, cur) => {
        if (row[cur]) {
          return (total += row[cur] + "~");
        } else {
          return "";
        }
      }, "");
      return res ? res.replace(/~$/, "") : "";
    },
    handleTableButton(row, type) {
      if (!type) return;
      this.$emit("operation", row, type);
    },
    /**
     * 后续扩展位
     * @param {*} methods
     * @param {*} row
     */
    handleClickon(methods, row) {
      if (!methods) return;
      this.$emit(methods, { methods, row });
    },
    handleSelectionChange(val) {
      if (this.showCheckBox && this.turnRadio) {
        // 选择项大于1时
        if (val.length > 1) {
          const del_row = val.shift();
          this.$refs.commonTable.toggleRowSelection(del_row, false);
        }
      }
      // 全选
      if (this.showCheckBox && this.selectedIdArr) {
        if (this.turnRadio) {
          this.$emit("handle-selection-change", val);
        } else {
          // 一般复选框都是走到这一步
          this.$emit("handle-selection-change", val);
        }
      } else {
        this.$emit("handle-selection-change", val);
      }
    },
    getRowKeys(row) {
      return row.id;
    },
    selectAll(val) {
      if (this.showCheckBox && this.turnRadio) {
        // 选择项大于1时
        if (val.length > 1) {
          val.length = 1;
        }
      }
      this.$emit("handle-selection-change", val);
    },
    // 斑马纹表格背景色
    tabRowClassName({ row, rowIndex }) {
      const classList = [];
      // 默认样式配置
      const index = rowIndex + 1;
      if (index % 2 === 0) {
        classList.push("even-row");
      } else {
        classList.push("odd-row");
      }
      // 自定义样式配置
      classList.push(this.rowClassName({ row, rowIndex }));
      return classList.join(" ");
    },
    cellClassName({ row, columnIndex }) {
      //{ row, column, rowIndex, columnIndex }
      if (row.confirmTag === 2 && columnIndex < this.tableLabel.length) {
        return "height_light_cell";
      } else {
        return "";
      }
    },
    buttonDisabled(item, row) {
      if (typeof item.disabled === "function")
        return item.disabled(row) || false;
      if (!item.disabled) return item.disabled;
    },
    /**
     * 单选框选中事件
     */
    rowClick(row) {
      this.$emit("rowClick", row);
    },
    handleSizeChange(val) {
      //分页每页大小改变操作事件
      this.page.pageSize = val;
      this.$emit("getlist", this.pageObj);
    },
    handleCurrentChange(val) {
      //分页当前页改变操作事件
      this.page.page = val;
      this.$emit("getlist", this.pageObj);
    },
    // 点击表头
    handleHeaderCLick(column) {
      this.$emit("handleHeaderCLick", column);
    },
    // 上面缺点是只能通过点击表头切换排序状态，点击小三角排序不会触发，处理sort-change事件和点击表头一样
    sortChange({ column }) {
      this.$emit("sortChange", column);
    },
  },
}
</script>

<style lang="scss" scoped>
.block {
  text-align: center;
  margin-top: 5px;
}
::v-deep .el-table__header,
::v-deep .el-table__body {
  margin: 0;
}

::v-deep .el-table::before {
  height: 0;
}

::v-deep .el-button {
  padding: 0;
  border: none;
  margin: 0 4px;
  padding: 0 4px 0 8px;
  border-left: 1px solid #e2e2e2;
  font-size: 14px;
  min-height: 14px;

  &:first-child {
    border-left: none;
  }
}

::v-deep .el-button + .el-button {
  margin-left: 0;
}

::v-deep .btn-right div {
  margin-right: 5px;
}

.btn-right div:empty {
  margin-right: 0px;
}

//斑马纹表格背景色
::v-deep .el-table .even-row {
  --el-table-tr-background-color: #f5fafb;
}

::v-deep .el-table .odd-row {
  --el-table-tr-background-color: #ffffff;
}

.el-table--border::after,
.el-table--group::after {
  width: 0;
}

.el-table--border {
  border: 1px solid #dcdfe6;
  overflow: hidden;
  border-radius: 3px;
}

::v-deep .el-table__fixed-right::before,
.el-table__fixed::before {
  background-color: transparent;
}
::v-deep .custom-table-header {
  th {
    //表头背景颜色
    background-color: #f9fbff !important;
    padding: 0px !important;
  }
}
.progress-line {
  .el-progress-bar__outer {
    height: 16px !important;
  }

  .el-progress-bar__outer,
  .el-progress-bar__inner {
    border-radius: 0 !important;
  }
}

.text-no-wrap {
  cursor: pointer;
  display: inline;
}

::v-deep .el-table {
  thead {
    //表头字体颜色
    color: #7f7f7f !important;
  }
  td {
    padding: 0 !important;
  }
  td.el-table__cell div,
  th.el-table__cell > .cell {
    //表头字体大小
    font-size: 14px;
  }

  th.el-table__cell > .cell {
    //表头
    font-weight: normal;
    line-height: 32px;
  }

  .cell {
    //行高,字体大小
    padding: 0 !important;
    // line-height: 39px;
  }

  .el-table__header-wrapper .checkBoxRadio .el-checkbox {
    display: none;
  }

  .el-checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .table-img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    padding: 6px 0;
    display: flex;
    align-items: center;
    margin: 0 auto;
    justify-content: center;
  }
}

::v-deep .el-table--small .el-table__cell {
  padding: 0;
}

::v-deep .el-dropdown-menu__item {
  padding: 5px 10px !important;
  .el-button {
    width: 100%;
    text-align: center;
    padding: 0 8px;
    margin: 0;
  }
}
.flex-box {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  .item {
    margin: 0 10px;
  }
}
::v-deep .el-tooltip {
  font-size: 16px;
}
</style>