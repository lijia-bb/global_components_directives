import debounce from './instruction/debounce'
import ellipsis from './instruction/ellipsis'
import drag from './instruction/drag'
import tooltip from './instruction/tooltip'
import copy from './instruction/copy'
// 自定义指令 //指令加多少就写在这个文件里，在花括号和下面的申明下
const directives = {
  debounce,
  drag,
  copy,
  tooltip,
  ellipsis
}
export default directives
