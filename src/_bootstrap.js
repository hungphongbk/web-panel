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
    debug: process.env.NODE_ENV === "development",
    connection:
      process.env.NODE_ENV === "development"
        ? "http://localhost:8081"
        : "http://web-panel.vaithuhay.com:1812"
  })
);
