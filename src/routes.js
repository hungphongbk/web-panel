import Vue from "vue";
import VueRouter from "vue-router";
import PageWebsites from "./pages/PageWebsites";
import PageSettings from "./pages/PageSettings";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/websites" },
  {
    path: "/websites",
    component: PageWebsites
  },
  {
    path: "/settings",
    component: PageSettings
  }
];

export default new VueRouter({ routes });
