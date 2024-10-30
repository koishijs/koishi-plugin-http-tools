<script setup lang="ts">
import {watch,ref,defineProps, defineEmits} from "vue"
import {send} from "@cordisjs/client";

import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
import type {HttpSummary} from "../../src/data";
import CaptureButton from "./CaptureButton.vue";
import SelectButton from "primevue/selectbutton";
import Uploader from "./Uploader.vue";
import Popover from "primevue/popover";

const props = defineProps<{
  unsaved: boolean
}>();

const model = defineModel<any>();

const mode = defineModel<string>('mode');

const emit = defineEmits(['save']);

watch(mode, (value)=>{
  if(value != 'capture' && value != 'test'){
    mode.value = 'capture';
  }
},{immediate:true})

const pop = ref<any>()


async function sendRequest(){
  await send('http/request.make', {requestId: model.value.id})
}

function createRequest(){
  send('http/request.create', {
    host:"",
    method:"GET",
    url:"",
    path:"",
    requestHeaders:{},
    requestBody:""
  });
}
</script>
<template>

  <Toolbar>
    <template #start>
      <Button icon="pi pi-plus" class="mr-2" severity="secondary" text v-tooltip.bottom="'创建 HTTP 请求'" @click="createRequest"/>
      <Button icon="pi pi-upload" severity="secondary" text v-tooltip.bottom="'上传已有 HTTP 请求'" @click="(e)=>pop.toggle(e)"/>
      <Popover ref="pop" style="padding: 0">
        <Uploader/>
      </Popover>
      <CaptureButton v-if="mode == 'capture'"/>
      <div v-else style="width: 3rem"></div>
    </template>

    <template #center>
      <SelectButton v-model="mode" :options="[{name:'捕获模式', value:'capture'},{name:'测试模式', value: 'test'}]" optionLabel="name" optionValue="value" :allowEmpty="false" aria-labelledby="basic" />
    </template>

    <template #end>
      <template v-if="model">
        <Button label="发送" size="large" v-if="!props.unsaved && mode != 'capture'" @click="sendRequest"></Button>
        <Button label="保存" size="large" v-else @click="emit('save')"></Button>
      </template>
      <span v-else style="height:2.75rem;width: 4rem"></span>
    </template>
  </Toolbar>
</template>
