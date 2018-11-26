import Vue from "vue";
import VueRouter from "vue-router";
import PageWebsites from "./pages/PageWebsites";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/websites" },
  {
    path: "/websites",
    component: PageWebsites
  }
];

export default new VueRouter({ routes });
