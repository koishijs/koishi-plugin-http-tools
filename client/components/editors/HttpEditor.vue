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
</script>

<template>
  <div style="display: flex;flex-direction: column;gap: 5px">
    <div style="padding: 8px 20px;">
      <InputGroup>
        <Select style="width: 200px!important;flex:unset" placeholder="请求方法" size="large"/>
        <InputGroupAddon>https://BASESERVER:PORT/</InputGroupAddon>
        <InputNumber placeholder="URL" size="large"/>
      </InputGroup>
    </div>
    <div style="padding-left: 20px">
      <span style="color:lawngreen">
        HTTP/1.1 200 OK
      </span>
      <span class="text-splitter"></span>
      <span>
        200ms
      </span>
      <span class="text-splitter"></span>
      <span style="color:red">
        Cache Miss
      </span>
    </div>
    <Tabs value="0">
      <TabList>
        <Tab value="0">请求</Tab>
        <Tab value="1">响应</Tab>
        <Tab value="2">选项</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <HttpRequestEditor/>
        </TabPanel>
        <TabPanel value="1">
          <HttpResponsePreviewer/>
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
