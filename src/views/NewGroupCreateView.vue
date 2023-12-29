<template>
  <div id="login-form">
    <div class="main-wrapper vh-100" style="background-color: #508bfc">
      <b-container class="py-5 h-100">
        <b-row class="d-flex justify-content-center align-items-center h-100">
          <b-col cols="12" class="col-md-8 col-md-8 col-lg-6 col-xl-5">
            <b-card class="shadow-2-strong" style="border-radius: 1rem">
              <b-card-body class="p-5 text-center">
                <h3 class="mb-5">Stwórz nową grupę</h3>
                <div class="form-outline mb-4">
                  <b-form @submit.prevent="addGroup">
                    <b-form-group
                        label="Nazwa grupy"
                        label-for="groupName"
                        label-cols="4"
                    >
                      <b-form-input
                          id="groupName"
                          type="text"
                          v-model="groupName"
                          @input="$v.groupName.$model = $event.trim()"
                          :state="!$v.groupName.$dirty ? null : !$v.groupName.$error"
                          required
                          placeholder="Podaj nazwę grupy"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        label="Url logo"
                        label-for="logo_url"
                        label-cols="4"
                    >
                      <b-form-input
                          id="logo_url"
                          type="text"
                          v-model="logoUrl"
                          @input="$v.logoUrl.$model = $event.trim()"
                          :state="!$v.logoUrl.$dirty ? null : !$v.logoUrl.$error"
                          required
                          placeholder="Podaj adres url do logo"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        label="Adres url"
                        label-for="groupSiteUrl"
                        label-cols="4"
                    >
                      <b-form-input
                          id="groupSiteUrl"
                          type="text"
                          v-model="groupSiteUrl"
                          @input="$v.groupSiteUrl.$model = $event.trim()"
                          :state="!$v.groupSiteUrl.$dirty ? null : !$v.groupSiteUrl.$error"
                          required
                          placeholder="Podaj adres url do strony organizacji"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        label="Hasło do grupy"
                        label-for="password"
                        label-cols="4"
                    >
                      <b-form-input
                          id="password"
                          type="text"
                          disabled
                          v-model="password"
                          @input="$v.password.$model = $event.trim()"
                          :state="!$v.password.$dirty ? null : !$v.password.$error"
                      ></b-form-input>
                      <b-button @click.prevent="generatePassword">Generuj hasło</b-button>
                      <b-button @click.prevent="copyToClipboard">Kopiuj</b-button>
                    </b-form-group>
                    <b-button type="submit" variant="primary" :disabled="$v.$invalid">Wyślij</b-button>
                  </b-form>
                  <b-button @click="showMsgBoxTwo"></b-button>
                  <b-button @click="$bvModal.show('modal-scoped')">Open Modal</b-button>

                  <b-modal
                      id="modal-scoped"
                      @ok="clearForm"
                  >
                    <template #modal-header>
                      <h5>Stworzona Grupa</h5>
                    </template>

                    <template #default>
                      <b-table striped hover :items="newGroupInfo" :fields="fields">
                        <template #cell(share)="data">
                          <b-button @click="prepareShareGroupAccessLink(data.item.id, data.item.password)"><b-icon icon="share" /></b-button>
                        </template>
                      </b-table>
                      <p>Dołączyłeś do grupy automatycznie. Opuścić grupę możesz w zakładce profil</p>
                      <p><b>Zachowaj ID</b> stworzonej grupy. <b>ID i hasło</b> posłuży innym użytkownikom do dołączenia
                        do tej grupy </p>
                    </template>

                    <template #modal-footer="{ ok }">
                      <!-- Przycisk z niestandardową wartością wyzwalacza zamknięcia -->
                      <b-button size="sm" variant="outline-secondary" @click="ok()">
                        Następna
                      </b-button>
                    </template>
                  </b-modal>
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
import {required, minLength, url} from 'vuelidate/lib/validators'

export default {
  name: "NewGroupCreateView",
  data() {
    return {
      groupName: null,
      logoUrl: null,
      groupSiteUrl: null,
      password: null,
      newGroupInfo: [],

      fields: [
        {
          key: 'id',
          label: 'ID'
        },
        {
          key: 'name',
          label: 'Nazwa'
        },
        {
          key: 'logo_url',
          label: 'Adres logo'
        },
        {
          key: 'group_site_url',
          label: 'Adres internetowy'
        },
        {
          key: 'password',
          label: 'Hasło'
        },
        {
          key: 'share',
          label: 'Udostępnij'
        }
      ]
    }
  },
  methods: {
    showMsgBoxTwo() {
      this.$bvModal.msgBoxOk('Please confirm that you want to delete everything.', {
        title: 'Please Confirm',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'primary',
        okTitle: 'Następna',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
    },
    async addGroup() {
      this.$store.state.waitForCreateSuccess = true;
      await this.$store.dispatch("addGroup", {
        name: this.groupName,
        logo_url: this.logoUrl,
        group_site_url: this.groupSiteUrl,
        password: this.password
      })
      this.newGroupInfo.push(this.$store.state.newGrupInfo);
      this.newGroupInfo[this.newGroupInfo.length - 1].password = this.password;
      this.$store.state.waitForCreateSuccess = false;
    },
    generatePassword() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let passwordLength = 6;
      let password = '';

      for (let i = 0; i < passwordLength; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }

      this.password = password;
    },
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.password);
        this.$bvToast.toast('Hasło skopiowane do schowka', {
          title: 'Sukces',
          variant: 'success',
          autoHideDelay: 5000,
        })
      } catch (err) {
        this.$bvToast.toast(`Nie udało się skopiować hasła do schowka: ${err}`, {
          title: 'Błąd',
          variant: 'danger',
          autoHideDelay: 5000,
        })
      }
    },
    async prepareShareGroupAccessLink(id, password) {
      try {
        await navigator.clipboard.writeText(`${process.env.VUE_APP_BASE_URL}join-to-group/${id}?password=${password}`);
        this.$bvToast.toast('Hasło skopiowane do schowka', {
          title: 'Sukces',
          variant: 'success',
          autoHideDelay: 5000,
        })
      } catch (err) {
        this.$bvToast.toast(`Nie udało się skopiować hasła do schowka: ${err}`, {
          title: 'Błąd',
          variant: 'danger',
          autoHideDelay: 5000,
        })
      }
    },
    clearForm() {
      this.groupName = null;
      this.logoUrl = null;
      this.groupSiteUrl = null;
      this.generatePassword()
    }
  },
  watch: {
    newGroupInfo: {
      handler() {
        this.$bvModal.show('modal-scoped');
      }
    }
  },
  created() {
    this.generatePassword()
  },
  validations: {
    groupName: {
      required,
      minLength: minLength(3)
    },
    logoUrl: {
      required
    },
    groupSiteUrl: {
      required,
      url
    },
    password: {
      required
    }
  }
}
</script>

<style scoped>

</style>