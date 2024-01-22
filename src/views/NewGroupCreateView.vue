<template>
      <b-container>
        <b-row class="d-flex justify-content-center align-items-center h-100">
          <b-col cols="12" class="col-md-8 col-md-8 col-lg-6 col-xl-5">
            <b-card>
              <b-card-body class="p-5 text-center">
                <h3 class="mb-5">{{ localT('newGroupCreateTitle') }}</h3>
                <div class="form-outline mb-4">
                  <b-form @submit.prevent="addGroup">
                    <b-form-group
                        :label="localT('groupNameLabel')"
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
                          :placeholder="localT('groupNamePlaceholder')"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        :label="localT('logoUrlLabel')"
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
                          :placeholder="localT('logoUrlPlaceholder')"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        :label="localT('groupSiteUrlLabel')"
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
                          :placeholder="localT('groupSiteUrlPlaceholder')"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        :label="localT('groupPasswordLabel')"
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
                      <b-button @click.prevent="generatePassword">{{localT('generatePasswordButton')}}</b-button>
                      <b-button @click.prevent="copyToClipboard">{{localT('copyToClipboardButton')}}</b-button>
                    </b-form-group>
                    <b-button type="submit" variant="primary" :disabled="$v.$invalid">{{localT('submitButton')}}</b-button>
                  </b-form>

                  <b-modal
                      id="modal-scoped"
                      @ok="clearForm"
                  >
                    <template #modal-header>
                      <h5>{{localT('headerModal')}}</h5>
                    </template>

                    <template #default>
                      <b-table striped hover :items="newGroupInfo" :fields="fields">
                        <template #cell(share)="data">
                          <b-button @click="prepareShareGroupAccessLink(data.item.id, data.item.password)"><b-icon icon="share" /></b-button>
                        </template>
                      </b-table>
                      <p>{{ localT('paragrafModal')}}</p>
                    </template>

                    <template #modal-footer="{ ok }">
                      <!-- Przycisk z niestandardową wartością wyzwalacza zamknięcia -->
                      <b-button size="sm" variant="outline-secondary" @click="ok()">
                        {{localT('nextButtonModal')}}
                      </b-button>
                    </template>
                  </b-modal>
                </div>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
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
          label: this.localT('idLabelTable')
        },
        {
          key: 'name',
          label: this.localT('nameLabelTable')
        },
        {
          key: 'logo_url',
          label: this.localT('logoUrlLabelTable')
        },
        {
          key: 'group_site_url',
          label: this.localT('groupSiteUrlLabelTable')
        },
        {
          key: 'password',
          label: this.localT('passwordLabelTable')
        },
        {
          key: 'share',
          label: this.localT('shareLabelTable')
        }
      ]
    }
  },
  methods: {
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
        this.$bvToast.toast(this.localT('messageCopyToClipboard'), {
          title: this.localT('titleCopyToClipboard'),
          variant: 'success',
          autoHideDelay: 5000,
        })
      } catch (err) {
        this.$bvToast.toast(this.localT('messageErrorCopyToClipboard') + ` ${err}`, {
          title: this.localT('titleErrorCopyToClipboard'),
          variant: 'danger',
          autoHideDelay: 5000,
        })
      }
    },
    async prepareShareGroupAccessLink(id, password) {
      try {
        await navigator.clipboard.writeText(`${process.env.VUE_APP_BASE_URL}join-to-group/${id}?password=${password}`);
        this.$bvToast.toast(this.localT('messagePrepareShareGroupAccessLink'), {
          title: this.localT('titlePrepareShareGroupAccessLink'),
          variant: 'success',
          autoHideDelay: 5000,
        })
      } catch (err) {
        this.$bvToast.toast(this.localT('titlePrepareShareGroupAccessLink') + ` ${err}`, {
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