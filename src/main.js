import Vue from "vue";
import App from "./App.vue";
import * as BsVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import router from "./routes";
Vue.use(BsVue);

Vue.config.productionTip = process.env.NODE_ENV === "production";

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
