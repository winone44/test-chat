<template>
  <div id="login-form">
    <div class="main-wrapper vh-100" style="background-color: #508bfc">
      <b-container class="py-5 h-100">
        <b-row class="d-flex justify-content-center align-items-center h-100">
          <b-col cols="12" class="col-md-8 col-md-8 col-lg-6 col-xl-5">
            <b-card class="shadow-2-strong" style="border-radius: 1rem">
              <b-card-body class="p-5 text-center">
                <h3 class="mb-5">Zaloguj się</h3>
                <div class="form-outline mb-4">
                  <b-form @submit.prevent="onSubmit">
                    <b-form-group
                        label="Email:"
                        label-for="email"
                    >
                      <b-form-input
                          id="email"
                          v-model="email"
                          type="email"
                          @input="$v.email.$model = $event.trim()"
                          :state="!$v.email.$dirty ? null : !$v.email.$error"
                          required
                          placeholder="Wpisz swój email"
                      ></b-form-input>
                      <b-form-invalid-feedback>
                        <span v-if="!$v.email.required">To pole jest wymagane. </span>
                        <span v-if="!$v.email.email">Błędny adres email. </span>
                      </b-form-invalid-feedback>
                      <b-form-valid-feedback>
                        <span>Wszystko jest okej. </span>
                      </b-form-valid-feedback>
                    </b-form-group>
                    <b-form-group
                        label="Hasło:"
                        label-for="password"
                    >
                      <b-form-input
                          if="password"
                          type="password"
                          v-model="password"
                          @input="$v.password.$model = $event.trim()"
                          :state="!$v.password.$dirty ? null : !$v.password.$error"
                          required
                          placeholder="Wpisz swoje hasło"
                      ></b-form-input>
                      <b-form-invalid-feedback>
                        <span v-if="!$v.password.required">To pole jest wymagane. </span>
                        <span v-if="!$v.password.minLength">Hasło musi posiadać conajmniej 8 znaków. </span>
                      </b-form-invalid-feedback>
                      <b-form-valid-feedback>
                        <span>Wszystko jest okej. </span>
                      </b-form-valid-feedback>
                    </b-form-group>
<!--                    <p>{{ $store.state.backendSerwerResponse }}</p>-->
                    <b-button type="submit" class="btn-lg btn-block mt-5" variant="primary">Zaloguj się</b-button>
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
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  name: "LoginView",
  data() {
    return {
      email: '',
      password: ''
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8)
    }
  },
  methods: {
     async onSubmit(){
       await this.$store.dispatch('login', {
         email: this.email,
         password: this.password
       })
       if (this.$store.getters.isAuth) {
         await this.getPeople();
         await this.$router.push({name: 'ChatView', params: {personId:this.$store.state.people[0].id}})
       }
    },
    async getPeople() {
      await this.$store.dispatch("getPeople", {
        id: this.$store.state.userId
      })
    },
  },
}
</script>

<style scoped>
#login-form {
  margin: 0;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: left;
  background-color: #fff;
}
</style>