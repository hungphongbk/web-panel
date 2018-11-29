<template>
<div :class="$style.container">
    <div v-if="available">
        <p v-for="log in logs" :key="log">{{log}}</p>
    </div>
</div>
</template>

<script>
export default {
  name: "TerminalLog",
  computed: {
    available() {
      return this.$store.state.ws.terminalWindows.executeRestartNginx;
    },
    logs() {
      return this.$store.state.ws.logs.executeRestartNginx;
    }
  }
};
</script>

<style lang="scss" module>
.container {
  background: rgba(#000, 0.78);
  padding: 0.5rem;
  p {
    color: white;
    font-family: Inconsolata, monospace;
    font-size: 0.75rem;
    margin-bottom: 0.3em;
    margin-top: 0.3em;
    word-break: break-all;
    &:hover {
      background: rgba(#fff, 0.12);
    }
  }
}
</style>
