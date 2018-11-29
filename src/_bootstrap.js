import axios from "axios";
import store from "./store";

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
import VueSocketIO from "vue-socket.io-extended";
import io from "socket.io-client";

Vue.use(
  VueSocketIO,
  io(
    process.env.NODE_ENV === "development"
      ? "http://localhost:8081"
      : "http://web-panel.vaithuhay.com:1812"
  ),
  { store }
);

import { Modal, Table, Button } from "bootstrap-vue/es/components";
Vue.use(Modal);
Vue.use(Table);
Vue.use(Button);
