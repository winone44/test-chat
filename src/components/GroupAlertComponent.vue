<template>
  <b-alert show :variant="alertStyle">
    <header>
      <h4 class="alert-heading">{{ title === '' ? 'Mój tytuł' : title }}</h4>
      <span>
          od {{ firstName }} {{ lastName }}
        </span>
      <span>
          {{ startDateTime | formatDateAlerts }}
        </span>
      <br/>
      <span>
         do {{ group }}
        </span>
      <span>
         {{ endDateTime | formatDateAlerts }}
        </span>
    </header>
    <hr>
    <p class="mb-0">
      {{ content === '' ? 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.' : content }}
    </p>
  </b-alert>
</template>

<script>

export default {
  name: 'GroupAlertComponent',
  props: {
    title: [String],
    firstName: [String],
    lastName: [String],
    content: [String],
    startDateTime: [String],
    endDateTime: [String],
    group: [String],
    alertStyle: [String]
  }
}

</script>

<style scoped>

</style>