export default {
  state: () => ({
    terminalWindows: {
      executeRestartNginx: false,
      createWordpressSite: false
    },
    logs: {
      executeRestartNginx: [],
      createWordpressSite: []
    }
  }),
  mutations: {
    SOCKET_TERMINALOPEN(state, eventName) {
      state.terminalWindows[eventName] = true;
      state.logs[eventName] = [];
    },
    SOCKET_TERMINALLOG(state, { eventName, ...rest }) {
      state.logs[eventName].push(rest);
    },
    SOCKET_TERMINALCLOSE() {
      // state.terminalWindows[eventName] = false;
      // state.logs[eventName] = [];
    }
  }
};
