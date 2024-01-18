<template>
  <b-card>
    <b-avatar :src="profilePictureCDN(this.$store.getters.person.profile_picture)"/>
    <b-button
        v-show="!isInputShow"
        @click="isInputShow = !isInputShow"
    >
      Zmień awatar
    </b-button>
    <b-form @submit.prevent="submitNewProfilePicture">
      <b-form-group
          id="profile-picture-url"
          label="Awatar URL:"
          label-for="input-profile-picture-url"
      >
        <b-form-input
            id="input-profile-picture-url"
            type="text"
            v-model="profilePicture"
            :disabled="!isInputShow"
            placeholder="Wpisz url awatara"
            @input="$v.profilePicture.$model = $event.trim()"
            :state="!$v.profilePicture.$dirty ? null : !$v.profilePicture.$error"
            required
        ></b-form-input>
      </b-form-group>
      <b-button :disabled="!isInputShow" type="submit">Zmień</b-button>
    </b-form>
  </b-card>
</template>

<script>
import {required, url} from 'vuelidate/lib/validators'
export default {
  name: 'ChangeProfileProfilePictureComponent',
  data() {
    return {
      isInputShow: false,
      profilePicture: this.$store.getters.person.profile_picture
    }
  },
  methods: {
    async submitNewProfilePicture() {
      const id = this.$store.state.userId
      const newData = {profile_picture: this.profilePicture}
      await this.$store.dispatch('patchPersonProfilePicture', {
        id, newData
      })

    }
  },
  validations: {
    profilePicture: {
      required,
      url
    }
  }
}

</script>

<style scoped>

</style>