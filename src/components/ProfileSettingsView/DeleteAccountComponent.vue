<template>
  <div>
    <b-button variant="danger" @click="delAccount">{{ localT('delAccountButton') }}</b-button>
  </div>
</template>

<script>

export default {
  name: "DeleteAccountComponent",
  methods: {
    async delAccount() {
      this.$bvModal.msgBoxConfirm(this.$t('DeleteAccountComponent.modalBoxMessage'), {
        title: this.$t('DeleteAccountComponent.modalBoxTitle'),
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: this.$t('DeleteAccountComponent.modalBoxOk'),
        cancelTitle: this.$t('DeleteAccountComponent.modalBoxCancel'),
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      }).then(async permit => {
        if (permit) {
          await this.$store.dispatch('delAccount');
          setTimeout(async () => {
            await this.$store.dispatch('logout');
          }, 3000)
        }
      })
    },
  }
}

</script>

<style scoped>

</style>