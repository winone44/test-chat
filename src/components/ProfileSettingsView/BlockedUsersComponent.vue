<template>
  <b-card>
    <b-table striped hover :fields="fields" :items="$store.state.blockedUsers">

      <template #cell(delBtn)="row">
        <b-button variant="outline-danger" size="sm" @click="delBlockUser(row.item.blocked_user.id)"  class="mr-1">
          {{ localT('unblock') }}
        </b-button>
      </template>
    </b-table>
  </b-card>
</template>

<script>
export default {
  name: 'BlockedUsersComponent',
  data() {
    return {
      fields: [
        {
          key: 'blocked_user.firstName',
          label: this.localT('firstName')
        },
        {
          key: 'blocked_user.lastName',
          label: this.localT('lastName')
        },
        { key: 'delBtn', label: '' }
      ]
    }
  },
  methods: {
    async getBlockUsers() {
      await this.$store.dispatch('getBlockUsers')
    },
    async delBlockUser(id) {
      await this.$store.dispatch('delBlockUsers', {
        blocked_user: id
      })
    }
  },
  created() {
    this.getBlockUsers()
  }
}
</script>

<style scoped>

</style>