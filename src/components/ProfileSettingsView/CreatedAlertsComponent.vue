<template>
  <b-card>
    <b-table striped hover :fields="fields" :items="$store.state.createdAlertsByUser">
      <template #cell(start_date)="row">
        {{ row.item.start_date | formatDateAlerts }}
      </template>

      <template #cell(end_date)="row">
        {{ row.item.end_date | formatDateAlerts }}
      </template>

      <template #cell(delBtn)="row">
        <b-button variant="outline-danger" size="sm" @click="delCreatedAlert(row.item.id)"  class="mr-1">
          {{ localT('delete') }}
        </b-button>
      </template>
    </b-table>
  </b-card>
</template>

<script>
export default {
  name: 'CreatedAlertsComponent',
  data() {
    return {
      fields: [
        {
          key: 'title',
          label: this.localT('title')
        },
        {
          key: 'content',
          label: this.localT('content')
        },
        {
          key: 'start_date',
          label: this.localT('startDate')
        },
        {
          key: 'end_date',
          label: this.localT('endDate')
        },
        {
          key: 'group.name',
          label: this.localT('groupName')
        },
        { key: 'delBtn', label: '' }
      ]
    }
  },
  methods: {
    async getCreatedAlertsByUser() {
      await this.$store.dispatch('getCreatedAlertsByUser')
    },
    async delCreatedAlert(id) {
      await this.$store.dispatch('delCreatedAlert', {
        id: id
      })
    }
  },
  created() {
    this.getCreatedAlertsByUser()
  }
}
</script>

<style scoped>

</style>