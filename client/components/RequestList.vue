<script setup lang="ts">
import ListBox from "primevue/listbox";
import Tag from 'primevue/tag';
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import Button from "primevue/button";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import ContextMenu from "primevue/contextmenu";

import {computed,ref} from 'vue'
import {getHttpMethodColor} from "./editors/http/colors";

const model = defineModel<Record<string,any>>();
const props = defineProps<{
  requests?: {
    capture?:any[],
    user?:any[]
  }
}>()

const menu = ref<{show:(event:any)=>void}>(null);
const menuModel = ([
  { label: 'Copy', icon: 'pi pi-copy' },
  { label: 'Rename', icon: 'pi pi-file-edit' }
]);

const listBoxOptions = computed(()=>([
  {
    label: '用户',
    items: props.requests?.user ?? []
  },
  {
    label: '捕获',
    items: props.requests?.capture ?? []
  }
]))
</script>

<template>
  <div style="height: 100%;width: 100%">
    <div style="margin:4px">
      <InputGroup style="width: 100%">
        <IconField style="width: 100%">
          <InputIcon class="pi pi-search" />
          <InputText type="text" placeholder="输入过滤器" style="width: 100%"/>
        </IconField>
        <Button icon="pi pi-filter"></Button>
      </InputGroup>
    </div>
    <ListBox
      :options="listBoxOptions"
      optionGroupLabel="label"
      optionGroupChildren="items"
      class="p-w-4 p-rb"
      :virtualScrollerOptions="{ itemSize: 64 }"
      listStyle="height:calc(100% - 20px)"
    >
      <template #optiongroup="slotProps">
        <div>{{ slotProps.option.label }} ({{slotProps.option?.items?.length ?? 0}})</div>
      </template>
      <template #option="slotProps">
        <div @contextmenu="(e)=>menu.show(e)" style="width: 100%">
          <div style="display: flex; flex-direction: row;">
            <Tag
              :value="slotProps.option.method?.toUpperCase()"
              :severity="getHttpMethodColor(slotProps.option.method)"
              style="font-size: 12px;padding:0.2rem 0.4rem"
            ></Tag><div style="margin-left: 10px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis">/api/login</div>
          </div>
          <span style="font-size:12px">api.github.com | 200ms | 200 OK</span>
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
