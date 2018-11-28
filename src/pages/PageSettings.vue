<template>
    <div>
        <h2>Settings</h2>
        <hr>
        <b-form>
            <b-form-group label="Specify Nginx default configuration directory">
                <b-form-input v-model="form.nginxConfDir"></b-form-input>
            </b-form-group>
            <b-form-group label="Specify Nginx restart command">
                <b-form-input v-model="form.nginxRestartCmd"></b-form-input>
            </b-form-group>
            <b-button variant="primary" @click="save">Save settings</b-button>
        </b-form>
    </div>
</template>
<script>
import bForm from "bootstrap-vue/es/components/form/form";
import bFormGroup from "bootstrap-vue/es/components/form-group/form-group";
import bFormInput from "bootstrap-vue/es/components/form-input/form-input";
import bButton from "bootstrap-vue/es/components/button/button";

export default {
  components: { bForm, bFormGroup, bFormInput, bButton },
  data: () => ({
    form: {
      nginxConfDir: "",
      nginxRestartCmd: ""
    }
  }),
  methods: {
    // : debounce(function(key, value) {
    //   this.$store.dispatch("settings/set", { key, value });
    // }, 100)
    save() {
      this.$store.dispatch("settings/set", this.form);
    }
  },
  beforeMount() {
    this.$store.subscribe(({ type, payload }) => {
      if (type === "settings/FETCH") Object.assign(this.form, payload);
    });
  }
};
</script>
<style lang="scss" module>
</style>
