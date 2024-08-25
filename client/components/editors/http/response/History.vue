<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import {ref,watch} from 'vue'

const currentHistory = defineModel('response');
const requests = ref([
  {id:'test',time:'2024/8/16 21:34',url:'https://www.timebather.cn/api/test', method:'GET', requestSize: '20k', response:'200 OK', size:'200K'},
  {id:'test2',time:'2024/8/16 21:34',url:'https://www.timebather.cn/api/test', method:'GET', requestSize: '20k', response:'200 OK', size:'200K'}
])

watch([currentHistory, requests],([history,_])=>{
  if(history == null){
    currentHistory.value = requests.value?.[0]
  }
},{immediate:true})
</script>

<template>
  <DataTable v-model:selection="currentHistory" :value="requests" selectionMode="single" metaKeySelection dataKey="id" tableStyle="min-width: 50rem">
    <Column field="time" header="发送时间"></Column>
    <Column field="method" header="方法"></Column>
    <Column field="url" header="URL"></Column>
    <Column field="requestSize" header="发送大小"></Column>
    <Column field="response" header="响应码"></Column>
    <Column field="size" header="返回大小"></Column>
  </DataTable>
</template>

<style scoped>

</style>
