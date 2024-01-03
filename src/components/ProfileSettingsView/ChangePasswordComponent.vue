<template>
  <b-card>
    <b-form @submit.prevent="onSubmit">
      <b-form-group
          :label="localT('currentPasswordLabel')"
          label-for="current-password-input"
      >
        <b-form-input
            id="current-password-input"
            type="password"
            v-model="currentPassword"
            @input="$v.currentPassword.$model = $event.trim()"
            :state="!$v.currentPassword.$dirty ? null : !$v.currentPassword.$error"
            required
            :placeholder="localT('currentPasswordPlaceholder')"
        ></b-form-input>
        <b-form-invalid-feedback>
          <span v-if="!$v.currentPassword.required">{{ localT('currentPasswordRequired') }}</span>
          <span v-if="!$v.currentPassword.minLength">{{ localT('currentPasswordMinLength') }} </span>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
          :label="localT('newPasswordLabel')"
          label-for="new-password-input"
      >
        <b-form-input
            id="new-password-input"
            type="password"
            v-model="newPassword"
            @input="$v.newPassword.$model = $event.trim()"
            :state="!$v.newPassword.$dirty ? null : !$v.newPassword.$error"
            required
            :placeholder="localT('newPasswordPlaceholder')"
        ></b-form-input>
        <b-form-invalid-feedback>
          <span v-if="!$v.newPassword.required">{{ localT('newPasswordRequired') }}</span>
          <span v-if="!$v.newPassword.minLength">{{ localT('newPasswordMinLength') }} </span>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
          :label="localT('confirmPasswordLabel')"
          label-for="confirm-password-input"
      >
        <b-form-input
            id="confirm-password-input"
            type="password"
            v-model="confirmPassword"
            @input="$v.confirmPassword.$model = $event.trim()"
            :state="!$v.confirmPassword.$dirty ? null : !$v.confirmPassword.$error"
            required
            :placeholder="localT('confirmPasswordPlaceholder')"
        ></b-form-input>
        <b-form-invalid-feedback>
          <span v-if="!$v.confirmPassword.required">{{ localT('confirmPasswordRequired') }}</span>
          <span v-if="!$v.confirmPassword.sameAsPassword">{{ localT('confirmPasswordSameAsPassword') }}</span>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="primary">{{ localT('submitButton') }}</b-button>
    </b-form>
  </b-card>
</template>

<script>
import {required, minLength, sameAs} from 'vuelidate/lib/validators'
export default {
  name: "ChangePasswordComponent",
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  },
  methods: {
    async onSubmit() {
      await this.$store.dispatch("changePassword", {
        current_password: this.currentPassword,
        new_password: this.newPassword
      })
    }
  },
  validations: {
    currentPassword: {
      required,
      minLength: minLength(8)
    },
    newPassword: {
      required,
      minLength: minLength(8)
    },
    confirmPassword: {
      required,
      minLength: minLength(8),
      sameAsPassword: sameAs('newPassword')
    },
  },
};

</script>

<style scoped>

</style>