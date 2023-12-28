<template>
  <div id="login-form">
    <div class="main-wrapper vh-100" style="background-color: #508bfc">
      <b-container class="py-5 h-100">
        <b-row class="d-flex justify-content-center align-items-center h-100">
          <b-col cols="12" class="col-lg-8 col-xl-8">
            <b-card class="shadow-2-strong" style="border-radius: 1rem">
              <b-card-body class="p-5 text-center">
                <h3 class="mb-5">{{ localT('registerTitle') }}</h3>
                <div class="form-outline mb-4">
                  <b-form @submit="onSubmit" @reset="onReset">
                    <b-form-group
                        :label="localT('firstNameLabel')"
                        label-for="firstName"
                        label-cols="4"
                    >
                      <b-form-input
                          id="firstName"
                          type="text"
                          v-model="firstName"
                          @input="$v.firstName.$model = $event.trim()"
                          :state="!$v.firstName.$dirty ? null : !$v.firstName.$error"
                          required
                          :placeholder="localT('firstNamePlaceholder')"/>
                      <b-form-invalid-feedback>
                        <span v-if="!$v.firstName.required">{{ localT('firstNameRequired') }}</span>
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group
                        :label="localT('lastNameLabel')"
                        label-for="lastName"
                        label-cols="4"
                    >
                      <b-form-input
                          id="lastName"
                          type="text"
                          v-model="lastName"
                          @input="$v.lastName.$model = $event.trim()"
                          :state="!$v.lastName.$dirty ? null : !$v.lastName.$error"
                          required
                          :placeholder="localT('lastNamePlaceholder')"/>
                      <b-form-invalid-feedback>
                        <span v-if="!$v.lastName.required">{{ localT('lastNameRequired') }}</span>
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group
                        :label="localT('usernameLabel')"
                        label-for="username"
                        label-cols="4"
                    >
                      <b-form-input
                          id="username"
                          type="text"
                          v-model="username"
                          @input="$v.username.$model = $event.trim()"
                          :state="!$v.username.$dirty ? null : !$v.username.$error"
                          required
                          :placeholder="localT('usernamePlaceholder')"/>
                      <b-form-invalid-feedback>
                        <span v-if="!$v.username.required">{{ localT('usernameRequired') }} </span>
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group
                        :label="localT('emailLabel')"
                        label-for="email"
                        label-cols="4"
                    >
                      <b-form-input
                          id="email"
                          type="email"
                          v-model="email"
                          @input="$v.email.$model = $event.trim()"
                          :state="!$v.email.$dirty ? null : !$v.email.$error"
                          required
                          :placeholder="localT('emailPlaceholder')"/>
                      <b-form-invalid-feedback>
                        <span v-if="!$v.email.required">{{ localT('emailRequired') }}</span>
                        <span v-if="!$v.email.email">{{ localT('emailInvalid') }} </span>
                      </b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group
                        :label=" localT('birthDateLabel') "
                        label-for="date_of_birth"
                        label-cols="4"
                    >
                      <b-form-input
                          id="date_of_birth"
                          type="date"
                          v-model="date_of_birth"
                          @input="$v.date_of_birth.$model = $event.trim()"
                          :state="date_of_birth ? !$v.date_of_birth.$error : null"
                          required
                      />
                      <b-form-invalid-feedback>
                        <span v-if="!$v.date_of_birth.required">{{ localT('birthDateRequired') }}</span>
                        <span
                            v-if="!$v.date_of_birth.minAge">{{ localT('birthDateMinAge') }}</span>
                        <span v-if="!$v.date_of_birth.maxAge">{{ localT('birthDateMaxAge') }}</span>
                      </b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group
                        :label="localT('passwordLabel') "
                        label-for="password"
                        label-cols="4"
                    >
                      <b-form-input
                          id="password"
                          type="password"
                          v-model="password"
                          @input="$v.password.$model = $event.trim()"
                          :state="!$v.password.$dirty ? null : !$v.password.$error"
                          required
                          :placeholder="localT('passwordPlaceholder')"/>

                      <b-form-invalid-feedback>
                        <span v-if="!$v.password.required">{{ localT('passwordRequired') }}</span>
                        <span v-if="!$v.password.minLength">{{ localT('passwordMinLength') }} </span>
                      </b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group
                        :label="localT('password2Label')"
                        label-for="password2"
                        label-cols="4"
                    >
                      <b-form-input
                          id="password2"
                          type="password"
                          v-model="password2"
                          @input="$v.password2.$model = $event.trim()"
                          :state="!$v.password2.$dirty ? null : !$v.password2.$error"
                          required
                          :placeholder="localT('password2Placeholder')"/>

                      <b-form-invalid-feedback>
                        <span v-if="!$v.password2.required">{{ localT('password2Required') }}</span>
                        <span v-if="!$v.password2.sameAsPassword">{{ localT('password2SameAsPassword') }}</span>
                      </b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group>
                    <b-form-checkbox
                        id="checkbox-1"
                        v-model="agreeTerms"
                        name="checkbox-1"
                        required
                        style="white-space: pre-wrap"
                    >
                      {{ localT('agreeTerms') }}
                    </b-form-checkbox>
                    </b-form-group>

                    <b-button type="submit" variant="primary" :disabled="$v.$invalid">{{ localT('registerSendButton') }}</b-button> &nbsp;
                    <b-button type="reset" variant="danger">{{ localT('registerClearButton') }}</b-button>
                  </b-form>
                </div>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import {required, minLength, email, sameAs} from 'vuelidate/lib/validators'

function minAge(age) {
  return function (value) {
    if (!value) return true
    const dateOfBirth = new Date(value)
    const currentDate = new Date()
    const ageDifference = currentDate - dateOfBirth
    const ageInYears = ageDifference / (365.25 * 24 * 60 * 60 * 1000)
    return ageInYears >= age
  }
}

function maxAge(age) {
  return function (value) {
    if (!value) return true
    const dateOfBirth = new Date(value)
    const currentDate = new Date()
    const ageDifference = currentDate - dateOfBirth
    const ageInYears = ageDifference / (365.25 * 24 * 60 * 60 * 1000)
    return ageInYears <= age
  }
}

const isChecked = value => value === true;

export default {
  name: 'RegisterView',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      password2: '',
      date_of_birth: '',
      agreeTerms: false
    }
  },
  validations: {
    firstName: {
      required
    },
    lastName: {
      required
    },
    username: {
      required
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8)
    },
    password2: {
      required,
      minLength: minLength(8),
      sameAsPassword: sameAs('password')
    },
    date_of_birth: {
      required,
      minAge: minAge(13),
      maxAge: maxAge(120)
    },
    agreeTerms: {
      isChecked
    }
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      await this.$store.dispatch('register', {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        email: this.email,
        password: this.password,
        password2: this.password2,
        date_of_birth: this.date_of_birth
      })
      await this.$router.push({name: 'LoginView'})
    },
    onReset(event) {
      event.preventDefault();
      this.username = '';
      this.email = '';
      this.password = '';
      this.password2 = '';
      this.date_of_birth = '';
      this.$v.$reset();
    }
  },
  computed: {
    error() {
      return this.$store.state.response;
    }
  }
};
</script>