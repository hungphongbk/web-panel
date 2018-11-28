<template>
    <div :class="$style.container">
        <h2>Settings</h2>
        <hr>
        <b-form>
            <b-tabs>
                <b-tab title="Nginx">
                    <b-form-group label="Specify Nginx default configuration directory">
                        <b-form-input v-model="form.nginxConfDir"></b-form-input>
                    </b-form-group>
                    <b-form-group label="Specify Nginx restart command">
                        <b-form-input v-model="form.nginxRestartCmd"></b-form-input>
                    </b-form-group>
                </b-tab>
                <b-tab title="SSH & Users">
                    <b-table hover :fields="userFields"></b-table>
                    <b-button @click="addUser">Add User</b-button>
                </b-tab>
            </b-tabs>
            <b-button variant="primary" @click="save">Save settings</b-button>
        </b-form>
        <b-modal ref="addUserModal" title="Add new user">
            <b-form>
                <b-form-group label="User Name (required)">
                    <b-form-input v-model="currentUser.userName"></b-form-input>
                </b-form-group>
                <b-form-group label="Directory (required)">
                    <b-form-input v-model="currentUser.homeDir"></b-form-input>
                </b-form-group>
            </b-form>
        </b-modal>
    </div>
</template>
<script>
import bTabs from "bootstrap-vue/es/components/tabs/tabs";
import bTab from "bootstrap-vue/es/components/tabs/tab";
import bForm from "bootstrap-vue/es/components/form/form";
import bFormGroup from "bootstrap-vue/es/components/form-group/form-group";
import bFormInput from "bootstrap-vue/es/components/form-input/form-input";
import bButton from "bootstrap-vue/es/components/button/button";

export default {
  components: { bForm, bFormGroup, bFormInput, bButton, bTabs, bTab },
  data: () => ({
    userFields: ["id", "name"],
    form: {
      nginxConfDir: "",
      nginxRestartCmd: "",
      users: []
    },
    currentUser: {
      userName: "",
      homeDir: ""
    }
  }),
  methods: {
    // : debounce(function(key, value) {
    //   this.$store.dispatch("settings/set", { key, value });
    // }, 100)
    addUser() {
      this.$refs.addUserModal.show();
    },
    save() {
      this.$store.dispatch("settings/set", this.form);
    }
  },
  beforeMount() {
    Object.assign(this.form, this.$store.state.settings);
    this.$store.subscribe(({ type, payload }) => {
      if (type === "settings/FETCH") Object.assign(this.form, payload);
    });
  }
};
</script>
<style lang="scss" module>
.container {
  :global(.tab-pane) {
    padding-top: 1rem;
    padding-bottom: 0.7rem;
  }
}
</style>
