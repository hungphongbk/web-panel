import Vue from "vue";
import Vuex from "vuex";
import settings from "./settings";
Vue.use(Vuex);

const storeSpec = {
    modules: {
      settings
    }
  },
  store = new Vuex.Store(storeSpec);
export default store;
