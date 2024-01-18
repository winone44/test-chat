<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card>
          <b-card-body>
            <h3 class="mb-5">Utwórz nowy alert</h3>
            <b-form @submit.prevent="addAlert">
              <b-form-group
                  label="Tytuł"
                  label-for="alert-title"
                  label-cols="4"
              >
                <b-form-input
                    id="alert-title"
                    type="text"
                    v-model="title"
                    @input="$v.title.$model = $event.trim()"
                    :state="!$v.title.$dirty ? null : !$v.title.$error"
                    required
                    placeholder="Wpisz tytuł alertu"
                />
              </b-form-group>
              <b-form-group
                  label="Treść"
                  label-for="content"
                  label-cols="4"
              >
                <b-form-textarea
                    id="content"
                    type="text"
                    v-model="content"
                    @input="$v.content.$model = $event.trim()"
                    :state="!$v.content.$dirty ? null : !$v.content.$error"
                    required
                    placeholder="Podaj adres url do logo"
                />
              </b-form-group>
              <b-form-group
                  label="Start wyświetlania alertu"
                  label-for="start-date"
                  label-cols="4"
                  description="Zwyczaj jest to data utworzenia alertu chyba że alert ma być opóźniony"
              >
                <b-row>
                  <b-col cols="12" md="8">
                    <b-form-datepicker
                        v-model="startDate"
                        today-button
                        reset-button
                        close-button
                        locale="pl-PL"
                        placeholder=""
                        :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                        @input="$v.startDate.$model = $event.trim()"
                        :state="!$v.startDate.$dirty ? null : !$v.startDate.$error"
                    />
                  </b-col>
                  <b-col cols="12" md="4">
                    <b-form-timepicker
                        v-model="startTime"
                        now-button
                        reset-button
                        locale="pl-PL"
                        placeholder=""
                        @input="$v.startTime.$model = $event.trim()"
                        :state="!$v.startTime.$dirty ? null : !$v.startTime.$error"
                    />
                  </b-col>
                </b-row>
              </b-form-group>
              <b-form-group
                  label="Koniec wyświetlania alertu"
                  label-for="end-date"
                  label-cols="4"
                  description="Zwyczaj jest to data początku przedsięwzięcia/imprezy"
              >
                <b-row>
                  <b-col cols="12" md="8">
                    <b-form-datepicker
                        v-model="endDate"
                        today-button
                        reset-button
                        close-button
                        locale="pl-PL"
                        placeholder=""
                        :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                        @input="$v.endDate.$model = $event.trim()"
                        :state="!$v.endDate.$dirty ? null : !$v.endDate.$error"
                    />
                  </b-col>
                  <b-col cols="12" md="4">
                    <b-form-timepicker
                        v-model="$v.endTime.$model"
                        now-button
                        reset-button
                        locale="pl-PL"
                        placeholder=""
                        :state="!$v.endTime.$dirty ? null : !$v.endTime.$error"
                    />
                  </b-col>
                </b-row>
              </b-form-group>

              <b-form-group
                  label="Alert kierowany jest do"
                  label-for="group"
                  label-cols="4"
              >
                <b-form-select
                    id="group"
                    :options="options"
                    v-model="$v.group.$model"
                    :state="!$v.group.$dirty ? null : !$v.group.$error"
                />
              </b-form-group>
              <b-form-group
                  label="Styl alertu"
                  label-for="alert-style"
                  label-cols="4"
              >
                <b-form-select
                    id="alert-style"
                    :options="options2"
                    v-model="$v.alertStyle.$model"
                    :state="!$v.alertStyle.$error"
                />
              </b-form-group>
              <b-button type="submit" variant="primary" :disabled="$v.$invalid">Wyślij</b-button>
            </b-form>
            <GroupAlertComponent
                class="mt-5"
                :title="title"
                :content="content"
                :startDateTime="startDateTime"
                :endDateTime="endDateTime"
                :group="group.name"
                :alertStyle="alertStyle"
            />
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

import {required} from "vuelidate/lib/validators";
import GroupAlertComponent from "@/components/GroupAlertComponent.vue";

export default {
  name: "NewAlertCreateView",
  components: {GroupAlertComponent},
  data() {
    return {
      title: '',
      content: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      group: {
        id: null,
        name: '',
      },
      alertStyle: 'success',
      options: [],
      options2: [
        {value: 'primary', text: 'Alert podstawowy'},
        {value: 'secondary', text: 'Alert dodatkowy'},
        {value: 'success', text: 'Alert sukcesu'},
        {value: 'danger', text: 'Alert o niebezpieczeństwie'},
        {value: 'warning', text: 'Alert ostrzegawczy'},
        {value: 'info', text: 'Alert informacyjny'},
        {value: 'light', text: 'Alert jasny'},
        {value: 'dark', text: 'Alert ciemny'},
      ]
    }
  },
  validations: {
    title: {
      required
    },
    content: {
      required
    },
    startDate: {
      required
    },
    startTime: {
      required
    },
    endDate: {
      required
    },
    endTime: {
      required
    },
    group: {
      id: { required }
    },
    alertStyle: {
      required
    },
  },
  methods: {
    async addAlert() {
      const datetimeStart = new Date(this.startDate + 'T' + this.startTime);
      const datetimeEnd = new Date(this.endDate + 'T' + this.endTime);
      await this.$store.dispatch("sendGrupAlert", {
        title: this.title,
        content: this.content,
        start_date: datetimeStart.toISOString(),
        end_date: datetimeEnd.toISOString(),
        group: this.group.id,
        style: this.alertStyle,
      })
    },
    async getPerson() {
      await this.$store.dispatch("getPerson", {
        id: this.$store.state.userId
      })
      this.options = this.$store.getters.person.groups.map(group => {
        return {value: group, text: group.name};
      });
    },
  },
  computed: {
    startDateTime() {
      return this.startDate + 'T' + this.startTime;
    },
    endDateTime() {
      return this.endDate + 'T' + this.endTime;
    }
  },
  async created() {
    await this.getPerson();
  }
}

</script>

<style scoped>

</style>