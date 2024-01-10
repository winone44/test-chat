<template>
  <div>
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
        ></b-form-input>
      </b-form-group>
      <b-form-group
          label="Treść alertu"
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
        ></b-form-textarea>
      </b-form-group>
      <b-form-group
          label="start_date"
          label-for="start-date"
          label-cols="4"
      >
        <b-row>
          <b-col>
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
            ></b-form-datepicker>
          </b-col>
          <b-col cols="4">
            <b-form-timepicker
                v-model="startTime"
                now-button
                reset-button
                locale="pl-PL"
                placeholder=""
                @input="$v.startTime.$model = $event.trim()"
                :state="!$v.startTime.$dirty ? null : !$v.startTime.$error"
            ></b-form-timepicker>
          </b-col>
        </b-row>
      </b-form-group>
      <b-form-group
          label="end_date"
          label-for="end-date"
          label-cols="4"
      >
        <b-row>
          <b-col>
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
            ></b-form-datepicker>
          </b-col>
          <b-col cols="4">
            <b-form-timepicker
                v-model="$v.endTime.$model"
                now-button
                reset-button
                locale="pl-PL"
                placeholder=""
                :state="!$v.endTime.$dirty ? null : !$v.endTime.$error"
            ></b-form-timepicker>
          </b-col>
        </b-row>
      </b-form-group>
      {{$v.group.$error}}
      {{$v.$invalid}}
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
        ></b-form-select>
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
        ></b-form-select>
      </b-form-group>
      <b-button type="submit" variant="primary" :disabled="$v.$invalid">Wyślij</b-button>
    </b-form>
    <GroupAlertComponent
        :title="title"
        :content="content"
        :startDate="startDate"
        :startTime="startTime"
        :endDate="endDate"
        :endTime="endTime"
        :group="group.name"
        :alertStyle="alertStyle"
    />
  </div>
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
        {value: 'primary', text: 'Primary Alert'},
        {value: 'secondary', text: 'Secondary Alert'},
        {value: 'success', text: 'Success Alert'},
        {value: 'danger', text: 'Danger Alert'},
        {value: 'warning', text: 'Warning Alert'},
        {value: 'info', text: 'Info Alert'},
        {value: 'light', text: 'Light Alert'},
        {value: 'dark', text: 'Dark Alert'},
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
      await this.$store.dispatch("sendGrupAlert", {
        title: this.title,
        content: this.content,
        start_date: this.startDate + 'T' + this.startTime,
        end_date: this.endDate + 'T' + this.endTime,
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
  async created() {
    await this.getPerson();
  }
}

</script>

<style scoped>

</style>