<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
</script>

<template>
  <div style="display: flex; flex-direction: column;gap: 30px">
    <div>
      <div style="display: flex; flex-direction: row;">
        <div style="padding-bottom: 10px; font-size:18px">HTTP 响应头</div>
      </div>
      <DataTable>
        <Column header="Key" headerStyle="width: 20rem"></Column>
        <Column header="Value" headerStyle="width: 20rem"></Column>
      </DataTable>
    </div>
    <div>
      <div style="display: flex; flex-direction: row;">
        <div style="padding-bottom: 10px; font-size:18px">HTTP 响应体</div>
        <div style="flex:1"></div>
      </div>
      <Textarea autoResize rows="10" cols="30" style="width: 100%"/>
    </div>
  </div>
</template>

<style scoped>

</style>
