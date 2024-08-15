<script setup lang="ts">
import Button from "primevue/button";
import CaptureButton from "./CaptureButton.vue";
import {send} from "@cordisjs/client";
async function clearCapture(){
  if(!await send('http/capture.clear'))
    return;
}
</script>

<template>
  <CaptureButton/>
  <Button icon="pi pi-trash" class="mr-2" severity="secondary" size="small" text v-tooltip.bottom="'清空捕获的请求'" @click="clearCapture"/>
</template>

