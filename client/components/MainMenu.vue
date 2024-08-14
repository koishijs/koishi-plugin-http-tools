<template>
  <Toolbar>
    <template #start>
      <Button icon="pi pi-plus" class="mr-2" severity="secondary" text v-tooltip.bottom="'创建 HTTP 请求'"/>
      <Button icon="pi pi-camera" class="mr-2" severity="secondary" text v-tooltip.bottom="'捕获 HTTP 请求'"/>
      <Button icon="pi pi-upload" severity="secondary" text v-tooltip.bottom="'上传已有 HTTP 请求'"/>
    </template>

    <template #center>
      Koishi HTTP Tools
    </template>

    <template #end>
      <SplitButton label="发送" :model="items"></SplitButton>
    </template>
  </Toolbar>
</template>

<script setup>
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
</script>
