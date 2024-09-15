<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import {ref,watch, inject, computed, onMounted} from 'vue'

const props = defineProps<{
  identifier: any
}>();

const request_list = inject<any>('request_list');

const currentHistory = defineModel<any>('response');
const historySelected = defineModel<any>('historySelected')
const requests = computed(()=>{
  return request_list.value?.capture?.filter(t=>t.originalRequest == props.identifier.id || (props.identifier.originalRequest && t.originalRequest == props.identifier?.originalRequest)) ?? []
})
const update = inject<(s:any)=>void>('setRequestModel');
onMounted(()=>{
  watch([currentHistory, requests],([history,_])=>{
    if(history == null || !history.originalRequest){
      currentHistory.value = requests.value?.[0]
      if(!currentHistory.value){
        historySelected.value = false;
        return;
      }
      historySelected.value = true;
      update({id:currentHistory.value?.id, type:'capture', originalRequest:currentHistory.value.originalRequest})
    }
    if(currentHistory.value?.originalRequest){
      historySelected.value = true;
    }
  },{immediate:true})
})
const currentRequest = computed({
  get(){
    return currentHistory.value
  },
  set(value){
    // currentHistory.value = value
    update?.({'type':'capture','id':value?.id,'originalRequest':value?.originalRequest})
  }
})
</script>

<template>
  <DataTable v-model:selection="currentRequest" :value="requests" selectionMode="single" metaKeySelection dataKey="id" tableStyle="min-width: 50rem">
    <Column field="time" header="发送时间">
      <template #body="data">
        {{ new Date(data.data.startTime) }}
      </template>
    </Column>
    <Column field="method" header="方法"></Column>
    <Column field="url" header="URL">
      <template #body="data">
        {{data.data.host}}{{data.data.path}}
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>

</style>
