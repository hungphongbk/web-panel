import Vue from "vue";
import VueRouter from "vue-router";
import PageWebsites from "./pages/PageWebsites";
import PageSettings from "./pages/PageSettings";
import PageSSHAccessKey from "./pages/PageSSHAccessKey";
import PageWordpressSites from "./pages/PageWordpressSites";

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
  },
  {
    path: "/ssh",
    component: PageSSHAccessKey
  },
  {
    path: "/create/wordpress",
    component: PageWordpressSites
  }
];

export default new VueRouter({ routes });
