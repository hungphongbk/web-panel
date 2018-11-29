export default {
  state: () => ({
    terminalWindows: {
      executeRestartNginx: false
    },
    logs: {
      executeRestartNginx: []
    }
  }),
  mutations: {
    SOCKET_TERMINALOPEN(state, eventName) {
      state.terminalWindows[eventName] = true;
      state.logs[eventName] = [];
    },
    SOCKET_TERMINALLOG(state, { eventName, log }) {
      state.logs[eventName].push(log);
    },
    SOCKET_TERMINALCLOSE() {
      // state.terminalWindows[eventName] = false;
      // state.logs[eventName] = [];
    }
  }
};
