import Vue from "vue";
import Vuex from "vuex";
import settings from "./settings";
import ws from "./ws";
Vue.use(Vuex);

const storeSpec = {
    modules: {
      settings,
      ws
    }
  },
  store = new Vuex.Store(storeSpec);
export default store;
