<template>
  <div>
    <div>
      <p>Lokalizacja: {{ location }}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "LocationCheckView",
  data() {
    return {
      location: null
    };
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition, this.showError, {enableHighAccuracy: true});
      } else {
        this.location = "Geolokalizacja nie jest wspierana przez tę przeglądarkę.";
      }
    },
    async showPosition(position) {
      this.location = `Szerokość geograficzna: ${position.coords.latitude}, Długość geograficzna: ${position.coords.longitude}. Przekierowanie...`;
      await this.submitNewDescription(position.coords.latitude, position.coords.longitude);
      await this.getPeople();
      await this.$router.push({name: 'ChatView', params: {personId: this.$store.getters.nearestUser}})
    },
    showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.location = "Sprawdź ustawienia przeglądarki. Użytkownik odmówił zgody na geolokalizację.";
          break;
        case error.POSITION_UNAVAILABLE:
          this.location = "Informacje o lokalizacji są niedostępne.";
          break;
        case error.TIMEOUT:
          this.location = "Próba uzyskania lokalizacji użytkownika trwała zbyt długo.";
          break;
        case error.UNKNOWN_ERROR:
          this.location = "Wystąpił nieznany błąd.";
          break;
      }
    },
    async submitNewDescription(latitude, longitude) {
      try {
        const id = this.$store.state.userId
        const newData = {
          latitude: latitude,
          longitude: longitude
        }
        await this.$store.dispatch('patchLocation', {
          id, newData
        })
      } catch (e) {
        console.log(e)
      }
    },
    async getPeople() {
      await this.$store.dispatch("getPeople", {
        id: this.$store.state.userId
      })
    },
  },
  mounted() {
    this.getLocation();
  }
}
</script>

<style scoped>

</style>
