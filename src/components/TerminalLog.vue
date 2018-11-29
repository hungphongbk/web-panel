<template>
<div>
    <div v-if="available" :class="$style.container">
        <p v-for="(logEntry,index) in logs" :key="index">
            <template v-if="logEntry.cmd">
                <span :class="$style.bash">{{command}}$ </span>{{logEntry.cmd}}
            </template>
            <template v-else>{{logEntry.log}}</template>
        </p>
    </div>
</div>
</template>

<script>
export default {
  name: "TerminalLog",
  props: {
    command: { type: String, required: true }
  },
  computed: {
    available() {
      return this.logs && this.logs.length > 0;
    },
    logs() {
      return this.$store.state.ws.logs[this.command];
    }
  }
};
</script>

<style lang="scss" module>
.container {
  background: rgba(#000, 0.82);
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
    .bash {
      color: rgba(#fff, 0.45);
    }
  }
}
</style>
