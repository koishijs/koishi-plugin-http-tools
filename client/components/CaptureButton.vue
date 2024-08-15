<script setup lang="ts">
import {inject} from "vue"
import Button from "primevue/button";
import {send, useRpc} from "@cordisjs/client";
import type {HttpSummary} from "../../src/data";

const model = useRpc<HttpSummary>();
const toast : (severity:string, summary:string, detail:string)=>void = inject("toast");
async function startCapture(){
  if(!await send('http/capture.start'))
    return;
  toast("success","操作成功","HTTP 请求捕获已开始");
}

async function stopCapture(){
  if(!await send('http/capture.stop'))
    return;
  toast("success","操作成功","HTTP 请求捕获已停止");
}
</script>
<template>
  <Button icon="pi pi-camera" class="mr-2" severity="secondary" size="small" text v-tooltip.bottom="'捕获 HTTP 请求'"
          v-if="!model.captureEnabled" @click="startCapture()"/>
  <Button icon="pi pi-stop" class="mr-2" severity="secondary" size="small" text v-tooltip.bottom="'捕获 HTTP 请求'"
          v-else @click="stopCapture()"/>
</template>
