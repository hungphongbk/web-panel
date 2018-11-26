<template>
  <div id="app" :class="$style.app">
    <b-navbar toggleable="sm" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">WebPanel</b-navbar-brand>
    </b-navbar>
    <main :class="$style.container">
      <div :class="$style.sidebar">
        <ul>
          <li><router-link to="/websites">Websites + Nginx</router-link></li>
          <li><router-link to="/settings">Settings</router-link></li>
        </ul>
      </div>
      <div :class="$style.content">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import bNavbar from "bootstrap-vue/es/components/navbar/navbar";
import bNavbarToggle from "bootstrap-vue/es/components/navbar/navbar-toggle";
import bNavbarBrand from "bootstrap-vue/es/components/navbar/navbar-brand";

export default {
  name: "app",
  components: {
    bNavbar,
    bNavbarToggle,
    bNavbarBrand
  },
  beforeMount(){
    // noinspection JSIgnoredPromiseFromCall
    this.$store.dispatch('settings/fetch')
  }
};
</script>
<style lang="scss" module>
.app,
.container {
  composes: d-flex from global;
}
.app {
  composes: flex-column from global;
}
html,
body,
.app {
  width: 100%;
  height: 100%;
}
.container {
  flex-grow: 1;
}
.sidebar {
  width: 250px;
  background: var(--gray-dark);
  color: white;
}
.sidebar ul {
  list-style: none;
  padding-inline-start: 0;
  li a {
    &,
    &:hover,
    &:active {
      color: inherit;
      text-decoration: inherit;
    }
    display: block;
    padding: {
      top: 0.7rem;
      bottom: 0.7rem;
      left: 1.3rem;
    }
    &:hover {
      background: rgba(#fff, 0.12);
    }
  }
}
.content {
  padding: 0.7rem 1.3rem;
  flex-grow: 1;
  hr {
    display: block;
  }
}
</style>
