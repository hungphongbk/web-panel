import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    nginxConfDir: "",
    nginxRestartCmd: "",
    users: []
  }),
  mutations: {
    FETCH(state, obj) {
      Object.assign(state, obj);
    }
  },
  actions: {
    async fetch({ commit }) {
      const settings = await axios.get("/api/settings");
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
    async set({ dispatch }, settings) {
      // await axios.post(`/api/settings/${key}`, { value });
      await Promise.all(
        Object.entries(settings).map(([key, value]) =>
          axios.post(`/api/settings/${key}`, { value })
        )
      );
      await dispatch("fetch");
    }
  }
};
