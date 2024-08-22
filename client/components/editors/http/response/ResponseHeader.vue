<script setup lang="ts">
import {computed} from 'vue'
import Column from "primevue/column";
import DataTable from "primevue/datatable";

const model = defineModel<any>();

const headers = computed(()=>Object.entries(model.value?.responseHeaders ?? {}).map(t=>({
  name:t[0],
  value:t[1]
})))
</script>

<template>
  <div>
    <DataTable :value="headers">
      <Column field="name" header="Name"></Column>
      <Column field="value" header="Value"></Column>
    </DataTable>
  </div>
</template>

<style scoped>

</style>
