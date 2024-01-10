<template>
  <b-alert show :variant="alertStyle">
    <header>
      <h4 class="alert-heading">{{ title === '' ? 'Mój tytuł' : title }}</h4>
      <span>
          od {{ $store.state.username }}
        </span>
      <span>
          {{ startDate }} {{ startTime.slice(0,-3) }}
        </span>
      <br/>
      <span>
         do {{ group }}
        </span>
      <span>
         {{endDate}} {{endTime.slice(0,-3)}}
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
    content: [String],
    startDate: [String],
    startTime: [String],
    endDate: [String],
    endTime: [String],
    group: [String],
    alertStyle: [String]
  }
}

</script>

<style scoped>

</style>