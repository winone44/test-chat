<template>
  <div>
    <b-form-input id="range-1"
                  :value="closestPoints"
                  @input="changeClosestPoints($event)"
                  type="range"
                  min="1"
                  max="20"
    />
    <div class="mt-2">Maksymalna liczba połączeń: {{ closestPoints }}</div>
  </div>
</template>

<script>

export default {
  name: "RangeInputClosestPoints",
  props: {
    closestPoints: [Number, String]
  },
  methods: {
    changeClosestPoints(newValue) {
      this.$emit('changeClosestPoints', newValue)
    }
  },
  watch: {

  }
}

</script>

<style scoped>

</style>