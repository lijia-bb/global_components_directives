
import components from './components'
import directives from './directives'

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
// 遍历注册全局组件
const install = function (Vue) {
    components.forEach((component) => {
        Vue.component(component.name, component)
    })
    Object.keys(directives).forEach((key) => {
        Vue.directive(key, directives[key])
    })
}
// 判断是否是直接引入文件,如果是，就不用调用 Vue.use()
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
  }
  
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  export default {
    install
  }
  