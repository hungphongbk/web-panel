<template>
    <b-form-group label="Specify an existing domain (required)" description="Make sure your domain has been pointed to IP 188.166.177.127 :)" :invalid-feedback="error" :state="valid>=0">
        <b-input-group>
            <b-form-input v-model="domain$"></b-form-input>
            <b-input-group-append>
                <b-btn :variant="checkVariant" @click="checkDomain">Check DNS</b-btn>
            </b-input-group-append>
        </b-input-group>
    </b-form-group>
</template>
<script>
import bFormGroup from "bootstrap-vue/es/components/form-group/form-group";
import bFormInput from "bootstrap-vue/es/components/form-input/form-input";
import bInputGroup from "bootstrap-vue/es/components/input-group/input-group";
import bInputGroupAppend from "bootstrap-vue/es/components/input-group/input-group-append";

export default {
  name: "DomainInput",
  components: {
    bFormGroup,
    bFormInput,
    bInputGroup,
    bInputGroupAppend
  },
  model: {
    prop: "domain",
    event: "change"
  },
  props: {
    domain: { type: String, required: true }
  },
  data: () => ({
    domain$: "",
    valid: 0,
    error: ""
  }),
  computed: {
    checkVariant() {
      return {
        "-1": "danger",
        "0": "secondary",
        "1": "success"
      }[this.valid.toString()];
    }
  },
  watch: {
    domain(value) {
      this.domain$ = value;
    }
  },
  sockets: {
    checkDomainResponse(parsed) {
      console.log(parsed);
      const found = parsed.found;
      if (!found) {
        this.valid = -1;
        this.error = '<b>ERROR</b> '+parsed.error;
        return;
      }
      const ipAddr = found.ipAddr.trim();
      if (ipAddr === "188.166.177.127") {
        this.valid = 1;
        this.$emit("change", found.domain);
      } else {
        this.valid = -1;
      }
    }
  },
  methods: {
    checkDomain() {
      this.$socket.emit("checkDomain", { domain: this.domain$ });
    }
  }
};
</script>
<style module>
</style>
