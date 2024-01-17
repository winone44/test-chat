import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./filters/index";
import { i18n } from '@/locales/i18n';
import mixins from '@/mixins';
import Vuelidate from 'vuelidate'

Vue.config.productionTip = false

Vue.use(Vuelidate);

Vue.mixin(mixins);

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')