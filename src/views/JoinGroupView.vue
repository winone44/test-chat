<template>
  <b-container>
    <b-row class="d-flex justify-content-center align-items-center h-100">
      <b-col cols="12" class="col-md-8 col-md-8 col-lg-6 col-xl-5">
        <b-card>
          <b-card-body>
            <b-form @submit.prevent="addMemberToGroup">
              <b-form-group
                  id="input-group-name"
                  label="Nazwa:"
                  label-for="input-name"
                  :description="$store.state.groupInfoDetail.user_count | declineUser"
              >
                <b-form-input
                    id="input-name"
                    type="text"
                    v-model="$store.state.groupInfoDetail.name"
                    disabled
                    placeholder="Enter group ID"
                    required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                  id="input-group-id"
                  label="ID:"
                  label-for="input-id"
              >
                <b-form-input
                    id="input-id"
                    type="number"
                    v-model="$store.state.groupInfoDetail.id"
                    disabled
                    placeholder="Enter group ID"
                    required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                  id="input-group-password"
                  label="Hasło:"
                  label-for="input-password"
              >
                <b-form-input
                    id="input-password"
                    type="text"
                    :disabled="isPasswordInputDisabled"
                    placeholder="Enter group password"
                    required
                    v-model="$v.password.$model"
                    :state="!$v.password.$dirty ? null : !$v.password.$error"
                ></b-form-input>
                <b-button
                    type="submit"
                    class="btn-lg btn-block mt-5"
                    variant="primary"
                    :disabled="$v.$invalid"
                >
                  Dodaj do grupy
                </b-button>
              </b-form-group>
            </b-form>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {required} from "vuelidate/lib/validators";
export default {
  name: "JoinGroupView",
  data() {
    return {
      groupId: this.$route.params.groupId,
      password: this.$route.query.password || ''
    };
  },
  methods: {
    async addMemberToGroup() {
      await this.$store.dispatch("addMemberToGroup", {
        group_id: this.groupId,
        password: this.password
      });
    },
    async getGroupDetail() {
      await this.$store.dispatch("getGroupDetail", {
        id: this.groupId,
      });
    }
  },
  validations: {
    password: {
      required
    }
  },
  computed: {
    isPasswordInputDisabled(){
      return this.$route.query.password === null
    }
  },
  mounted() {
    this.getGroupDetail();
    if(this.password) {
      console.log('asdasd')
    }
  }
}
</script>

<style scoped>

</style>