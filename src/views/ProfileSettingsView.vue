<template>
  <b-card no-body>
    <b-tabs pills card :vertical="vertical" lazy fill>
      <b-tab :title="localT('generalInformationTitle')" active>
        <GeneralInformationComponent />
      </b-tab>
      <b-tab :title="localT('blockedMembers')">
        <BlockedMembersComponent />
      </b-tab>
      <b-tab :title="localT('passwordChange')">
        <ChangePasswordComponent />
      </b-tab>
      <b-tab :title="localT('deleteProfile')">
        <DeleteAccountComponent />
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>

import GeneralInformationComponent from "@/components/ProfileSettingsView/GeneralInformationComponent.vue";
import ChangePasswordComponent from "@/components/ProfileSettingsView/ChangePasswordComponent.vue";
import DeleteAccountComponent from "@/components/ProfileSettingsView/DeleteAccountComponent.vue";
import BlockedMembersComponent from "@/components/ProfileSettingsView/BlockedMembersComponent.vue";

export default {
  name: "ProfileSettingsView",
  components: {BlockedMembersComponent, DeleteAccountComponent, ChangePasswordComponent, GeneralInformationComponent},
  data() {
    return {
      size: 0,
      resizeListener: null,
    }
  },
  mounted() {
    let that = this
    that.size = window.innerWidth
    this.resizeListener = function() {
      that.size = window.innerWidth
    }
    window.addEventListener('resize', this.resizeListener);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  },
  computed: {
    vertical() {
      return this.size > 992;
    }
  },
}

</script>


<style scoped>

</style>