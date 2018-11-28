import axios from "axios";

axios.interceptors.response.use(
  function({ data }) {
    // Do something with response data
    return data;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

import Vue from "vue";
import VueSocketIO from "vue-socket.io";

Vue.use(
  new VueSocketIO({
    // debug: process.env.NODE_ENV === "development",
    debug: true,
    connection:
      process.env.NODE_ENV === "development"
        ? "http://localhost:8081"
        : "http://web-panel.vaithuhay.com:1812"
  })
);

import { Modal, Table } from "bootstrap-vue/es/components";
Vue.use(Modal);
Vue.use(Table);
