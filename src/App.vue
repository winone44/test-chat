<template>
  <div id="app">
    <NavigationComp />
    <router-view/>
  </div>
</template>

<script>
import NavigationComp from "@/components/NavigationComp";
export default {
  components: {NavigationComp}
}
</script>

<style>
body,
html {
  height: 100%;
  margin: 0;
  background: #7F7FD5;
  background: -webkit-linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5);
  background: linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5);
}
</style>
