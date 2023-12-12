<template>
  <div>
    <b-form>
      <b-form-group
          id="input-group-name"
          label="Nazwa:"
          label-for="input-name"
          :description="'Grupa ma ' + $store.state.groupInfoDetail.user_count + ' użytkowników'"
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
    </b-form>
    {{$store.state.groupInfoDetail.id}},
    {{$store.state.groupInfoDetail.name}}
    {{$store.state.groupInfoDetail.user_count}}
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