<template>
  <div>
    <span v-b-modal.modal-center>+</span>
    <b-modal
        id="modal-center"
        centered
        title="Dodaj grupę"
        @show="resetModal"
        @hidden="resetModal"
        @ok="addMemberToGroup"
    >
      <form ref="form" @submit.stop.prevent="addMemberToGroup">
        <b-form-group
            label="ID grupy"
            label-for="id-input"
        >
          <b-form-input
              id="id-input"
              v-model="groupId"
              required
          ></b-form-input>
        </b-form-group>
        <b-form-group
            label="Hasło"
            label-for="password-input"
        >
          <b-form-input
              id="password-input"
              v-model="password"
              required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "ButtonAddGroupModalComponent",
  data() {
    return {
      groupId: null,
      password: null
    }
  },
  methods: {
    resetModal() {
      this.groupId = null;
      this.password = null;
      this.IdState = null;
      this.passwordState = null;
    },
    async addMemberToGroup() {
      await this.$store.dispatch("addMemberToGroup", {
        group_id: this.groupId,
        password: this.password
      })
    },
  }
}
</script>

<style scoped>

</style>