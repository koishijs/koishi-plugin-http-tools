<script setup lang="ts">
import Button from "primevue/button";
import HttpTools from "./components/HttpTools.vue";
</script>

<template>
  <div class="k-http-tools-page">
    <HttpTools/>
  </div>
</template>

<style scoped>
  .k-http-tools-page{
    display: flex;
    flex-direction: column;
    padding-left: var(--activity-width);
    width: 100%;
    height: calc(100vh - var(--footer-height));
    overflow: hidden;
  }
</style>

<style>
#app,body,html{
  height:100%;
}
</style>
