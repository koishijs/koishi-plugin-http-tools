<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {computed} from 'vue'
const stackTrace = `    at REPL31:1:7
    at ContextifyScript.runInThisContext (node:vm:121:12)
    at REPLServer.defaultEval (node:repl:599:22)
    at bound (node:domain:432:15)
    at REPLServer.runBound (node:domain:443:12)
    at REPLServer.p [as eval] (file:///C:/Users/TimeBather/AppData/Roaming/npm/node_modules/tsx/dist/loader.mjs:1:786)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)`

const stack = computed(()=>stackTrace.split('\n').map(t=>({name:t})))
</script>

<template>
  <DataTable :value="stack">
    <Column field="name" header="Name"></Column>
  </DataTable>
</template>

<style scoped>

</style>
