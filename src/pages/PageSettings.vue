<template>
    <div>
        <h2>Settings</h2>
        <hr>
        <b-form>
            <b-form-group label="Specify Nginx default configuration directory">
                <b-form-input v-model="nginxConfDir"></b-form-input>
            </b-form-group>
            <b-form-group label="Specify Nginx restart command">
                <b-form-input v-model="nginxRestartCmd"></b-form-input>
            </b-form-group>
        </b-form>
    </div>
</template>
<script>
import bForm from "bootstrap-vue/es/components/form/form";
import bFormGroup from "bootstrap-vue/es/components/form-group/form-group";
import bFormInput from "bootstrap-vue/es/components/form-input/form-input";
import debounce from "lodash/debounce";
import store from "../store";

const spreadComputeds = keys =>
  keys
    .map(key => [
      key,
      {
        get() {
          return store.state.settings[key];
        },
        set: debounce(function(value) {
          store.dispatch("settings/set", { key, value });
        }, 100)
      }
    ])
    .reduce(
      (acc, [key, value]) =>
        Object.assign({}, acc, {
          [key]: value
        }),
      {}
    );

export default {
  components: { bForm, bFormGroup, bFormInput },
  computed: {
    ...spreadComputeds(["nginxConfDir", "nginxRestartCmd"])
  },
  methods: {
    set: debounce(function(key, value) {
      this.$store.dispatch("settings/set", { key, value });
    }, 100)
  }
};
</script>
<style lang="scss" module>
</style>
