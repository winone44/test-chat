<template>
  <div class="card mt-3">
    <b-row v-for="(alert, index) in $store.state.groupAlerts.results" :key="index">
      <b-col>
        <GroupAlertComponent
            :title="alert.title"
            :firstName="alert.user.firstName"
            :lastName="alert.user.lastName"
            :content="alert.content"
            :startDateTime="alert.start_date"
            :endDateTime="alert.end_date"
            :group="alert.group.name"
            :alertStyle="alert.style"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button :disabled="this.$store.state.groupAlerts.previous === null" @click="getPrevAlerts" block>
          <span v-show="!isSpinnerShow">{{ localT('previous') }}</span>
          <b-spinner v-show="isSpinnerShow" small label="Small Spinning"></b-spinner>
        </b-button>
        <b-button :disabled="this.$store.state.groupAlerts.next === null" @click="getAlerts" block>
          <span v-show="!isSpinnerShow">{{ localT('next') }}</span>
          <b-spinner v-show="isSpinnerShow" small label="Small Spinning"></b-spinner>
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import GroupAlertComponent from "@/components/GroupAlertComponent.vue";

export default {
  name: "ListGrupAlertComponent",
  components: {GroupAlertComponent},
  data () {
    return {
      isSpinnerShow: false,
    }
  },
  methods: {
    async getAlerts() {
      let page = 1;
      if (!this.$store.state.groupAlerts) {
        this.isSpinnerShow = true;
        await this.$store.dispatch("getGrupAlert", 1)
        this.isSpinnerShow = false;
      } else if (this.$store.state.groupAlerts && this.$store.state.groupAlerts.next !== null) {
        this.isSpinnerShow = true;
        page = this.$store.state.groupAlerts.next;
        await this.$store.dispatch("getGrupAlert", page)
        this.isSpinnerShow = false;
      }
    },
    async getPrevAlerts() {

      if (this.$store.state.groupAlerts && this.$store.state.groupAlerts.previous !== null) {
        let page = this.$store.state.groupAlerts.previous;
        this.isSpinnerShow = true;
        await this.$store.dispatch("getGrupAlert", page)
        this.isSpinnerShow = false;
      }
    }
  },
  async created() {
    await this.getAlerts();
  }
}
</script>

<style scoped>

</style>