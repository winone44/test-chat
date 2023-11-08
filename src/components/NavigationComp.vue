<template>
  <div>
    <b-navbar toggleable="sm" type="light" variant="transparent">

      <b-navbar-brand>
        <b-img width="50px" rounded="circle" src="/logo.png"></b-img>
        Banda
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-if="!$store.getters.isAuth" to="/">Home</b-nav-item>
          <b-nav-item v-if="!$store.getters.isAuth" to="/register">Rejestracja</b-nav-item>
          <b-nav-item v-if="$store.getters.isAuth" :to="{name: 'ChatView', params: {personId: this.$store.getters.nearestUser}}">Czat</b-nav-item>
          <b-nav-item v-if="!$store.getters.isAuth" to="/login">Login</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav v-if="$store.getters.isAuth" class="ml-auto">

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>{{ $store.state.username }}</em>
            </template>
            <b-dropdown-item :to="{ name: 'ProfileView', params: { personId: this.$store.state.userId }}">Profil</b-dropdown-item>
            <b-dropdown-item @click="logout" v-if="$store.getters.isAuth">Wyloguj</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "NavigationComp",

  methods: {
    logout() {
      this.$store.dispatch('logout');
    }
  }

}
</script>

<style scoped>
b-navbar {
  background-color: rgb(148, 25, 25);
}
</style>