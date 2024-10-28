<script setup lang="ts">
import ListBox from "primevue/listbox";
import Tag from 'primevue/tag';
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import Button from "primevue/button";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import ContextMenu from "primevue/contextmenu";

import {computed,ref,watch,defineModel} from 'vue'
import {getHttpMethodColor} from "./editors/http/colors";
import {send} from '@cordisjs/client'

const model = defineModel<any>();
const props = defineProps<{
  requests?: any
}>()

const menu = ref<{show:(event:any)=>void}>(null);
const menuModel = ([
  {
    label: '删除',
    icon: 'pi pi-trash',
    command: ()=>{
      send('http/request.delete', itemRightClicked.value)
    }
  },
  {
    label: '下载',
    icon: 'pi pi-download',
    command: ()=>{
      send('http/request', itemRightClicked.value).then((data)=>{
        let blob = new Blob([JSON.stringify(data)]);
        let objectURL = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectURL;
        link.download = "request.json";
        link.click();
      })
    }
  }
]);

const listBoxOptions = computed(()=>props.requests)

const itemRightClicked = ref(null);

function displayMenu(event, item){
  itemRightClicked.value = item;
  menu.value.show(event);
}

const filter = ref<string>("");

function useFilter(request:any){
    if(filter.value.length == 0)
      return true;
    if(request.host && request.host.includes(filter.value)){
      return true;
    }
    if(request.path && request.path.includes(filter.value)){
      return true;
    }
    if(request.path && request.host && (request.host + request.path).includes(filter.value)){
      return true;
    }
    return false;
}
const filteredOptions = computed(()=>{
  return listBoxOptions.value.map(t=>({...t,items:t.items.filter(item=>useFilter(item))}));
})
</script>

<template>
  <div style="height: 100%;width: 100%">
    <div style="margin:4px">
      <InputGroup style="width: 100%">
        <IconField style="width: 100%">
          <InputIcon class="pi pi-search" />
          <InputText v-model="filter" type="text" placeholder="输入过滤器" style="width: 100%"/>
        </IconField>
        <Button icon="pi pi-filter"></Button>
      </InputGroup>
    </div>
    <ListBox
      v-model="model"
      :options="filteredOptions"
      :dataKey="(o)=>o.type + '.' + o.id"
      optionGroupLabel="label"
      optionGroupChildren="items"
      class="p-w-4 p-rb"
      :virtualScrollerOptions="{ itemSize: 64 }"
      listStyle="height:calc(100% - 20px)"
    >
      <template #optiongroup="slotProps">
        <div style="display: flex; flex-direction: row">
          <div>{{ slotProps.option.label }} ({{slotProps.option?.items?.length ?? 0}})</div>
          <div style="flex:1"></div>
          <div v-if="slotProps.option.menu">
            <component :is="slotProps.option.menu"></component>
          </div>
        </div>
      </template>
      <template #option="slotProps">
        <div @contextmenu="(e)=>displayMenu(e,{id:slotProps.option.id, type: slotProps.option.type})" style="width: 100%">
          <div style="display: flex; flex-direction: row;">
            <Tag
              :value="slotProps.option.method?.toUpperCase()"
              :severity="getHttpMethodColor(slotProps.option.method)"
              style="font-size: 12px;padding:0.2rem 0.4rem"
            ></Tag>
            <div style="margin-left: 10px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis">
              {{
                (slotProps.option.path ?
                  (slotProps.option.path.startsWith('/') ?
                    slotProps.option.path : '/'+slotProps.option.path)
                  : '/'
                )
              }}</div>
          </div>
          <span style="font-size:12px">{{ slotProps.option?.host ?? 'localhost' }}</span>
        </div>
      </template>
    </ListBox>
  </div>
  <ContextMenu ref="menu" :model="menuModel"/>
</template>

<style scoped>
.p-w-4{
  width: 100%;
}
.p-rb{
  border: none;
  border-right: 1px solid var(--p-listbox-border-color);
  border-radius: 0;
  box-shadow: none;
  height:100%;
}
</style>

<style>
.p-virtualscroller::-webkit-scrollbar{
  width: 6px;
  height:6px;
}

.p-virtualscroller::-webkit-scrollbar-thumb{
  background: #cccccc;
}

.p-rb > .p-listbox-list-container > .p-virtualscroller > .p-virtualscroller-content > .p-listbox-option-group{
  height:48px !important;
}
</style>
