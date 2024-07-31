// 统一导出 // 导入颜色选择器组件
import CommonTable from './my_table.vue'

// 存储组件列表
const components = [CommonTable]

// 导出的对象必须具有 install，才能被 Vue.use() 方法安装
export default components
