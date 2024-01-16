<template>
  <b-card>
    <b-table striped hover :fields="fields" :items="$store.state.blockedUsers">

      <template #cell(delBtn)="row">
        <b-button variant="danger" size="sm" @click="delBlockMember(row.item.blocked_user.id)"  class="mr-1">
          Usuń
        </b-button>
      </template>
    </b-table>
  </b-card>
</template>

<script>
export default {
  name: 'BlockedMembersComponent',
  data() {
    return {
      fields: [
        {
          key: 'blocked_user.firstName',
          label: 'Imię'
        },
        {
          key: 'blocked_user.lastName',
          label: 'Nazwisko'
        },
        { key: 'delBtn', label: '' }
      ]
    }
  },
  methods: {
    async getBlockMembers() {
      await this.$store.dispatch('getBlockUsers')
    },
    async delBlockMember(id) {
      await this.$store.dispatch('delBlockUsers', {
        blocked_user: id
      })
    }
  },
  created() {
    this.getBlockMembers()
  }
}
</script>

<style scoped>

</style>