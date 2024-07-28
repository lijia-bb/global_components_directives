import debounce from './instruction/debounce' //指令加多少就写在这个文件里，在花括号和下面的申明下
// 自定义指令
const directives = {
  debounce
}
// 批量注册指令
export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}
