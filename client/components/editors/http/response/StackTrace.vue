<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {computed} from 'vue'

const model = defineModel<any>();
const stackTrace = computed(()=>model.value.stackTrace);

const stack = computed(()=>stackTrace.value.split('\n').filter((t,i)=>i>0).map(t=>({name:t})))
</script>

<template>
  <DataTable :value="stack">
    <Column field="name" header="Name"></Column>
  </DataTable>
</template>

<style scoped>

</style>
