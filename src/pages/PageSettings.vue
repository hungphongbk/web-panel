<template>
    <div>
        <h2>Settings</h2>
        <hr>
        <b-form>
            <b-form-group label="Specify Nginx default configuration directory">
                <b-form-input v-model="nginxConfDir"></b-form-input>
            </b-form-group>
        </b-form>
    </div>
</template>
<script>
import bForm from "bootstrap-vue/es/components/form/form";
import bFormGroup from "bootstrap-vue/es/components/form-group/form-group";
import bFormInput from "bootstrap-vue/es/components/form-input/form-input";
import debounce from "lodash/debounce";

export default {
  components: { bForm, bFormGroup, bFormInput },
  computed: {
    nginxConfDir: {
      get() {
        return this.$store.state.settings.nginxConfDir;
      },
      set(value) {
        this.set("nginxConfDir", value);
      }
    }
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
