<template>
  <div>
    <b-button variant="danger" @click="delAccount">Usuń swoje konto</b-button>
  </div>
</template>

<script>

export default {
  name: "DeleteAccountComponent",
  methods: {
    async delAccount() {
      this.$bvModal.msgBoxConfirm('Czy na pewno chcesz usunąć konto. Ta operacja jest nieodwracalna!', {
        title: 'Usuwanie konta',
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
          await this.$store.dispatch('delAccount');
          console.log('Usunięto konto, za chwilę nastąpi wylogowanie')
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