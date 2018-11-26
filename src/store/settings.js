import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    nginxConfDir: "",
    nginxRestartCmd: ""
  }),
  mutations: {
    FETCH(state, obj) {
      Object.assign(state, obj);
    }
  },
  actions: {
    async fetch({ commit }) {
      const settings = await axios.get("/settings");
      commit(
        "FETCH",
        settings.reduce(
          (acc, { key, value }) =>
            Object.assign({}, acc, {
              [key]: value
            }),
          {}
        )
      );
    },
    async set({ dispatch }, { key, value }) {
      await axios.post(`/settings/${key}`, { value });
      await dispatch("fetch");
    }
  }
};
