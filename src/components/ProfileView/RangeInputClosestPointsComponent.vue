<template>
  <div>
    <b-form-input id="range-1"
                  :value="closestPoints"
                  @input="changeClosestPoints($event)"
                  type="range"
                  min="1"
                  max="20"
    />
    <div class="mt-2">{{$t('RangeInputClosestPointsComponent.maximumNumberOfConnections', {closestPoints: closestPoints})}}</div>
  </div>
</template>

<script>

export default {
  name: "RangeInputClosestPointsComponent",
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