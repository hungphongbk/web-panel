<template>
    <div>
        <h2>Create new Wordpress Site</h2>
        <hr>
        <b-form>
            <b-form-group label="Specify an existing domain (required)">
                <domain-input v-model="form.domain"></domain-input>
            </b-form-group>
            <b-form-group label="Enter MySQL Database name (required)">
                <b-form-input v-model="form.dbName"></b-form-input>
            </b-form-group>
        </b-form>
        <b-button @click="create">Install now!</b-button>
    </div>
</template>

<script>
import bForm from "bootstrap-vue/es/components/form/form";
import bFormGroup from "bootstrap-vue/es/components/form-group/form-group";
import bFormInput from "bootstrap-vue/es/components/form-input/form-input";
import bButton from "bootstrap-vue/es/components/button/button";
import DomainInput from "../components/DomainInput";
export default {
  components: {DomainInput, bForm, bFormGroup, bFormInput, bButton },
  name: "PageWordpressSites",
  data: () => ({
    form: {
      domain: "",
      dbUser: "myowngrave",
      dbPassword: "dxq7tpTIOeELw2zs",
      dbName: ""
    }
  }),
  sockets: {
    connect() {},
    createWordpressSiteLog() {}
  },
  methods: {
    create() {
      this.$socket.emit("createWordpressSite", this.form);
    }
  }
};
</script>

<style lang="scss" module>
</style>
