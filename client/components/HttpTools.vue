<script setup lang="ts">
import MainMenu from "./MainMenu.vue";
import RequestList from "./RequestList.vue";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import HttpEditor from "./editors/HttpEditor.vue";
import {ref} from "vue";
import {useRpc} from '@cordisjs/client'
const model = useRpc();
import Toast from "primevue/toast";
import {provide} from 'vue'
import {useToast} from "primevue/usetoast";
import HttpEditorProxy from "./editors/HttpEditorProxy.vue";
const toast = useToast()
provide('toast',(severity:"success" | "info" | "warn" | "error" | "secondary" | "contrast", summary:string, detail:string)=>{
  toast.add({
    severity: severity,
    summary: summary,
    detail: detail,
    life: 5000
  })
})

const current = ref();
const currentModel = ref();
</script>

<template>
  <div style="display: flex;flex-direction: column;height:100%">
    <Toast />
    <MainMenu/>
    <div style="display: flex;flex-direction: row;height:100%">
      <Splitter style="height: 100%;width: 100%">
        <SplitterPanel :size="20" style="min-width: 300px">
          <RequestList :requests="model" v-model="current"/>
        </SplitterPanel>
        <SplitterPanel :size="80">
          <HttpEditorProxy v-if="current" :type="current['type']" :id="current['id']"/>
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<style scoped>
</style>
