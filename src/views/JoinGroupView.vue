<template>
  <div>
    <b-form>
      <b-form-group
          id="input-group-name"
          label="Nazwa:"
          label-for="input-name"
          :description="$store.state.groupInfoDetail.user_count | declineUser"
      >
        <b-form-input
            id="input-id"
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
            v-model="password"
            disabled
            placeholder="Enter group password"
            required
        ></b-form-input>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
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