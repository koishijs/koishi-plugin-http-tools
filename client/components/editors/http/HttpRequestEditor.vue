<script setup lang="ts">
import {computed,ref} from 'vue'
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import InputText from "primevue/inputtext";

const model = defineModel<any>();

const headers = computed(()=>[
    ...Object.entries(model.value?.requestHeaders ?? {}).map(([key,value])=>({
    key, value
  })),
  {key:'',value:''}
]);

const editingRows = ref([])

console.info(headers)

function onRowEditSave(event){
  if(!model.value)
    return
  if(!model.value.requestHeaders)
    model.value.requestHeaders = {};
  if(event.data.key == event.newData.key){
    model.value.requestHeaders[event.data.key] =  event.newData.value;
  }else{
    delete model.value.requestHeaders[event.data.key];
    model.value.requestHeaders[event.newData.key] = event.newData.value;
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column;gap: 30px">
    <div>
      <div style="display: flex; flex-direction: row;">
        <div style="padding-bottom: 10px; font-size:18px">HTTP 请求头</div>
        <div style="flex:1"></div>
        <div>
          <Button label="+" size="small"/>
        </div>
      </div>
      <DataTable :value="headers" editMode="row" @row-edit-save="onRowEditSave"
                 :pt="{
        table: { style: 'min-width: 50rem' },
        column: {
            bodycell: ({ state }) => ({
                style:  state['d_editing']&&'padding-top: 0.75rem; padding-bottom: 0.75rem'
            })
        }
    }" v-model:editingRows="editingRows"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column header="Key" field="key" headerStyle="width: 20rem">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column header="Value" field="value" headerStyle="width: 20rem">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
      </DataTable>
    </div>
    <div>
      <div style="display: flex; flex-direction: row;">
        <div style="padding-bottom: 10px; font-size:18px">HTTP 请求体</div>
        <div style="flex:1"></div>
      </div>
      <Textarea autoResize rows="10" cols="30" style="width: 100%" v-model="model.requestBody"/>
    </div>
  </div>
</template>

<style scoped>

</style>
