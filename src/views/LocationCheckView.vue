<template>
  <div>
    <div>
      <p>{{localT('location')}} {{ location }}</p>
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
        this.location = this.localT('getLocationError');
      }
    },
    async showPosition(position) {
      this.location = this.$t('LocationCheckView.showPosition', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      await this.submitNewDescription(position.coords.latitude, position.coords.longitude);
      await this.getPeople();
      await this.$router.push({name: 'ChatView', params: {personId: this.$store.getters.nearestUser}})
    },
    showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.location = this.localT('getLocationShowErrorPERMISSION_DENIED');
          break;
        case error.POSITION_UNAVAILABLE:
          this.location = this.localT('getLocationShowErrorPOSITION_UNAVAILABLE');
          break;
        case error.TIMEOUT:
          this.location = this.localT('getLocationShowErrorTIMEOUT');
          break;
        case error.UNKNOWN_ERROR:
          this.location = this.localT('getLocationShowErrorUNKNOWN_ERROR');
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
      await this.$store.dispatch("getPeople")
    },
  },
  mounted() {
    this.getLocation();
  }
}
</script>

<style scoped>

</style>
