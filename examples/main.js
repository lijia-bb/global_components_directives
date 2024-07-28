import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入ElementUI
import ElementUI from 'element-ui'
//
Vue.use(ElementUI)

//注册全局组件
import Components from './components/index.js'
Vue.use(Components)

//注册全局指令
import Directive from './directives/index.js'
Vue.use(Directive)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
