import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
//引入ElementUI
import ElementUI from 'element-ui'
Vue.use(ElementUI)
import lijia from 'lijia_g'
Vue.use(lijia)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
