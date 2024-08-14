<script setup lang="ts">
import MainMenu from "./MainMenu.vue";
import RequestList from "./RequestList.vue";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import HttpEditor from "./editors/HttpEditor.vue";

const model = defineModel()
</script>

<template>
  <div style="display: flex;flex-direction: column;height:100%">
    <MainMenu/>
    <div style="display: flex;flex-direction: row;height:100%">
      <Splitter style="height: 100%;width: 100%">
        <SplitterPanel :size="20" style="min-width: 300px">
          <RequestList :requests="model"/>
        </SplitterPanel>
        <SplitterPanel :size="80">
          <HttpEditor/>
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<style scoped>
</style>
