<template>
    <div>
        <h2>Websites</h2>
        <hr>
        <div :class="$style.commands">
            <b-button variant="warning" @click="restartNginx">Restart Nginx</b-button>
        </div>
    </div>
</template>
<script>
import bButton from "bootstrap-vue/es/components/button/button";
export default {
  name: "PageWebsites",
  components: {
    bButton
  },
  data: () => ({
    isConnected: false
  }),
  sockets: {
    connect() {
      this.isConnected = true;
    }
  },
  methods: {
    restartNginx() {
      this.$socket.emit("executeRestartNginx");
    }
  }
};
</script>
<style module>
.commands {
  composes: d-flex from global;
}
</style>
