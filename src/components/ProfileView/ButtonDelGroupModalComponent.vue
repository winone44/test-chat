<template>
  <b-button size="sm" variant="danger" @click="delGroup(row.item.id, row)" class="mr-2">
    x
  </b-button>
</template>

<script>

export default {
  name: "ButtonDelGroupModalComponent",
  props: {
    row: [Object]
  },
  methods: {
    async delGroup(groupId) {
      this.$bvModal.msgBoxConfirm('Potwierdź, że chcesz odłączyć się od grupy.', {
        title: 'Opuszczanie grupy',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'TAK',
        cancelTitle: 'NIE',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      }).then(async permit => {
        if (permit) {
          await this.$store.dispatch("delMemberFromGroup", {
            group_id: groupId
          })
          this.$store.state.person.groups = this.$store.state.person.groups.filter(object => object.id !== groupId);
        }
      })

    },
  }
}

</script>

<style scoped>

</style>