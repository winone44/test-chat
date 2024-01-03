<template>
  <b-card>
    <h5 class="card-header">{{ $store.getters.person.firstName }} {{ $store.getters.person.lastName }}</h5>
    <b-card-body>
      <p class="card-text">{{localT('gender')}} <b>{{ $store.getters.person.gender }}</b></p>
      <p class="card-text">{{localT('birthDate')}} <b>{{ $store.getters.person.date_of_birth }}</b></p>
      <p class="card-text">{{localT('age')}} <b>{{ $store.getters.person.age }}</b></p>
      <p class="card-text">{{localT('emailAddress')}} <b>{{ $store.getters.person.email }}</b></p>
      <p class="card-text">{{localT('username')}} <b>{{ $store.getters.person.username }}</b></p>
      <p class="card-text">{{localT('followedGroupsCount')}} <b>{{ $store.getters.person.groups.length }}</b></p>
      <p class="card-text">{{localT('lastKnownLocation')}}
        <b>{{ $store.getters.person.latitude }},
        {{ $store.getters.person.longitude }}</b>
      </p>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: "GeneralInformationComponent",

  methods: {
    async getPerson() {
      await this.$store.dispatch("getPerson", {
        id: this.$store.state.userId
      })
    },
  },
  async created() {
    await this.getPerson();
  }
}

</script>

<style scoped>

</style>