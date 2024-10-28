<script setup lang="ts">
import Tabs from "primevue/tabs";
import Tab from "primevue/tab";
import TabPanel from "primevue/tabpanel";
import TabPanels from "primevue/tabpanels";
import TabList from "primevue/tablist";
import InputGroup from "primevue/inputgroup";
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import InputGroupAddon from "primevue/inputgroupaddon";
import HttpRequestEditor from "./http/HttpRequestEditor.vue";
import HttpResponsePreviewer from "./http/HttpResponsePreviewer.vue";
import InputText from "primevue/inputtext";
import {computed, defineModel, ref, watch, inject} from 'vue'
import {getHttpMethodColor} from "./http/colors";
import Tag from "primevue/tag";

const model = defineModel<any>('request');

const props = defineProps<{
  response: any
}>();

const identifier = defineModel<any>('identifier');

const method = computed({
  get(){
    return model.value.method?.toUpperCase()
  },
  set(value){
    console.info("UPD",model.value.method, value.toLowerCase())
    model.value.method = value.toLowerCase();
  },
})

const tabs = ref("0");

const update = inject<(s:any)=>void>('setRequestModel');

watch(identifier, (identifier)=>{
  if(identifier.originalRequest)
    tabs.value = "1";
  else
    tabs.value = "0";
},{immediate:true});

watch(tabs, (value)=>{
  if(value === "1" && !identifier.value.originalRequest){

  }else if(value === "0" && identifier.value.originalRequest){
    update({id:identifier.value.originalRequest, type:'user'})
  }
})

</script>

<template>
  <div style="display: flex;flex-direction: column;gap: 5px;overflow: hidden;height: 100%">
    <div style="padding: 8px 20px;">
      <InputGroup>
        <Select
          style="width: 200px!important;flex:unset"
          placeholder="请求方法"
          size="large"
          v-model="method"
          :options="['GET','POST','PUT','PATCH','UPDATE','DELETE','OPTIONS']"
        >
          <template #value="slotProps">
            <Tag
              :value="slotProps.value?.toUpperCase()"
              :severity="getHttpMethodColor(slotProps.value)"
              style="font-size: 12px;padding:0.2rem 0.4rem"
            ></Tag>
          </template>
        </Select>
        <InputText placeholder="URL" size="large" v-model="model.url"/>
      </InputGroup>
    </div>
    <Tabs style="flex: 1 1 0;overflow: hidden;" v-model:value="tabs">
      <TabList>
        <Tab value="0">请求</Tab>
        <Tab value="1">响应</Tab>
        <Tab value="2">选项</Tab>
      </TabList>
      <TabPanels style="padding: 0;flex:1;display: flex;overflow: hidden;width: 100%">
        <TabPanel value="0" style="padding: 1rem;flex:1;width: 100%">
          <HttpRequestEditor v-model="model"/>
        </TabPanel>
        <TabPanel value="1" style="padding: 0;flex:1;display: flex;width: 100%">
          <HttpResponsePreviewer v-model:identifier="identifier" v-model="props.response" v-if="tabs == '1'"/>
        </TabPanel>
        <TabPanel value="2">

        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>

</template>

<style scoped>
  .text-splitter:before{
    content: '|';
  }
</style>
