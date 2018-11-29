<template>
    <div>
        <h2>Create new Wordpress Site</h2>
        <hr>
        <b-form>
            <domain-input v-model="form.domain"></domain-input>
            <b-form-group label="Enter MySQL Database name (required)">
                <b-form-input v-model="form.dbName"></b-form-input>
            </b-form-group>
        </b-form>
        <b-button :disabled="!form.domain || status===1" @click="create">{{statusLabel}}</b-button>
    </div>
</template>

<script>
import bForm from "bootstrap-vue/es/components/form/form";
import bFormGroup from "bootstrap-vue/es/components/form-group/form-group";
import bFormInput from "bootstrap-vue/es/components/form-input/form-input";
import bButton from "bootstrap-vue/es/components/button/button";
import DomainInput from "../components/DomainInput";
import { SOCKET_EVENT_TERMINAL_CLOSE } from "../../universal/consts";
export default {
  components: { DomainInput, bForm, bFormGroup, bFormInput, bButton },
  name: "PageWordpressSites",
  data: () => ({
    form: {
      domain: "",
      dbUser: "myowngrave",
      dbPassword: "dxq7tpTIOeELw2zs",
      dbName: ""
    },
    status: 0
  }),
  computed: {
    statusLabel() {
      return [
        "Install now!",
        "Installing...",
        "Done. Return to Websites list!"
      ][this.status];
    }
  },
  sockets: {
    connect() {},
    [SOCKET_EVENT_TERMINAL_CLOSE]() {
      console.log("completed");
      this.status = 2;
    }
  },
  methods: {
    create() {
      this.$socket.emit("createWordpressSite", this.form);
      this.status = 1;
    }
  }
};
</script>

<style lang="scss" module>
</style>
