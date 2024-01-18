<template>
  <b-card no-body>
    <b-card-body>
      <div class="d-flex flex-column align-items-center text-center">
        <b-avatar
            :src="profilePictureCDN(this.$store.getters.person.profile_picture)"
            class="mt-3 user_img"
            :class="{online: $store.getters.person.online}"
        />
        <b-row class="mt-3">
          <b-col>
            <h4>{{ $store.getters.person.firstName }} {{ $store.getters.person.lastName }}</h4>
          </b-col>
        </b-row>
          <b-row class="mt-1">
            <b-col v-if="!showTextArea" class="text-secondary" style="white-space: pre-line">{{$store.getters.person.description}}</b-col>
            <b-col v-else class="mt-3">
              <b-form @submit.prevent="submitNewDescription">
                <b-form-textarea v-model="description"></b-form-textarea>
                <b-button type="submit" variant="primary">Wyślij</b-button>
              </b-form>
            </b-col>
            <b-col
                cols="1"
                v-if=" $route.params.personId === $store.state.userId && !showTextArea">
              <b-icon
                  icon="pencil-square"
                  class="mt-4"
                  @click="showTextArea = !showTextArea" />
            </b-col>
          </b-row>
          <div v-if="$route.params.personId !== $store.state.userId" class="mt-4">
            <b-button
                variant="outline-danger"
                class="mr-3"
                v-if="!$store.getters.person.blocked_user" @click="blockUser($store.getters.person.id)"
            >
              Zablokuj
            </b-button>
            <b-button
                variant="outline-success"
                class="mr-3"
                v-if="$store.getters.person.blocked_user" @click="unblockUser($store.getters.person.id)"
            >
              Odblokuj
            </b-button>
            <b-button
                variant="primary"
                :to="{name: 'ChatView', params: {personId: this.$store.getters.person.id}}"
            >
              Wyślij wiadomość
            </b-button>
          </div>
        </div>
    </b-card-body>
  </b-card>
</template>

<script>

export default {
  name: "ProfileCardComponent",
  data() {
    return {
      description: this.$store.getters.person.description,
      showTextArea: false,
    }
  },
  methods: {
    async blockUser(id) {
      await this.$store.dispatch("addBlockUsers", {
        blocked_user: id
      });
    },
    async unblockUser(id) {
      await this.$store.dispatch("delBlockUsers", {
        blocked_user: id
      });
    },
    async submitNewDescription() {
      try {
        const id = this.$store.state.userId
        const newData = {description: this.description}
        await this.$store.dispatch('patchPersonDescription', {
          id, newData
        })

        this.showTextArea = false;
      } catch (e) {
        console.log(e)
      }
    },
  },
}

</script>

<style scoped>
.user_img {
  height: 100px;
  width: 100px;
  -webkit-box-shadow: 0px 0px 24px 0px rgba( 255, 0, 0, 1);
  -moz-box-shadow: 0px 0px 24px 0px rgba( 255, 0, 0, 1);
  box-shadow: 0px 0px 24px 0px rgba( 255, 0, 0, 1);
}

.online {
  -webkit-box-shadow: 0px 0px 24px 0px rgba( 0, 255, 0, 1);
  -moz-box-shadow: 0px 0px 24px 0px rgba( 0, 255, 0, 1);
  box-shadow: 0px 0px 24px 0px rgba( 0, 255, 0, 1);
}
</style>