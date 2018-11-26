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
