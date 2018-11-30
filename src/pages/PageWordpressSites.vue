<template>
    <div>
        <h2>Create new Wordpress Site</h2>
        <hr>
        <b-form>
            <domain-input v-model="form.domain"></domain-input>
            <b-form-group label="Enter MySQL Database name (required)">
                <b-form-input v-model="form.dbName"></b-form-input>
            </b-form-group>
            <b-form-group label="Which way do you want to install Wordpress sites?">
                <b-form-radio-group :options="installMethods" v-model="form.installMethod"></b-form-radio-group>
            </b-form-group>
            <b-card v-if="form.installMethod==='auto'" bg-variant="light" class="mb-4">
                <b-form-group horizontal label="URL">
                    <b-form-input v-model="form.installInfo.url"></b-form-input>
                </b-form-group>
                <b-form-group horizontal label="Title (required)">
                    <b-form-input v-model="form.installInfo.title"></b-form-input>
                </b-form-group>
                <b-form-group horizontal label="Admin Email (required)">
                    <b-form-input v-model="form.installInfo.adminEmail"></b-form-input>
                </b-form-group>
                <b-form-group horizontal label="Admin User (required)">
                    <b-form-input v-model="form.installInfo.adminUser"></b-form-input>
                </b-form-group>
                <b-form-group horizontal label="Admin Password (required)">
                    <b-form-input v-model="form.installInfo.adminPassword" type="password"></b-form-input>
                </b-form-group>
            </b-card>
        </b-form>
        <b-button :disabled="!form.domain || status===1" @click="create">{{statusLabel}}</b-button>
    </div>
</template>

<script>
import bForm from "bootstrap-vue/es/components/form/form";
import bFormGroup from "bootstrap-vue/es/components/form-group/form-group";
import bFormInput from "bootstrap-vue/es/components/form-input/form-input";
import bButton from "bootstrap-vue/es/components/button/button";
import bFormRadioGroup from "bootstrap-vue/es/components/form-radio/form-radio-group";
import bCard from "bootstrap-vue/es/components/card/card";

import DomainInput from "../components/DomainInput";
import { SOCKET_EVENT_TERMINAL_CLOSE } from "../../universal/consts";
export default {
  components: {
    DomainInput,
    bForm,
    bFormGroup,
    bFormInput,
    bButton,
    bFormRadioGroup,
    bCard
  },
  name: "PageWordpressSites",
  data: () => ({
    form: {
      domain: "",
      dbUser: "myowngrave",
      dbPassword: "dxq7tpTIOeELw2zs",
      dbName: "",
      installMethod: "auto",
      installInfo: {
        url: "",
        title: "",
        adminUser: "",
        adminPassword: "",
        adminEmail: ""
      }
    },
    installMethods: [
      { text: "Automatic with filled information below", value: "auto" },
      { text: "Manually", value: "manually" }
    ],
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
  watch: {
    "form.domain"(value) {
      if (value.length > 0) {
        this.form.dbName = value;
        this.form.installInfo.url = "http://" + value;
      }
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
