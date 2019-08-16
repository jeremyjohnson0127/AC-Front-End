import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import jQuery from "jquery";
global.jQuery = jQuery;
global.$ = jQuery;
import "jquery-ui/ui/widgets/datepicker";
import "jquery-ui/ui/widgets/selectable";
import "jquery-ui/ui/effects/effect-slide";
import "jquery-ui/themes/base/core.css";
import "jquery-ui/themes/base/datepicker.css";
import "jquery-ui/themes/base/theme.css";
import "bootstrap-select/dist/js/bootstrap-select";
import "bootstrap-select/dist/css/bootstrap-select.css";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/js/bootstrap.js";
import VueGoogleCharts from "vue-google-charts";
Vue.use(VueGoogleCharts);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
