<script setup lang="ts">
import MainMenu from "./MainMenu.vue";
import RequestList from "./RequestList.vue";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import HttpEditor from "./editors/HttpEditor.vue";
import {ref,computed,watch} from "vue";
import {useRpc} from '@cordisjs/client'
const model = useRpc<any>();
const capturedRequests = computed(()=>([
  {
    label: '捕获',
    type: 'capture',
    items: model.value?.capture.map(t=>({...t, type:'capture'})) ?? [],
    menu: CaptureListMenu
  }
]))
const userRequests = computed(()=>([
  {
    label: '用户',
    type: 'user',
    items: model.value?.user.map(t=>({...t, type:'user'})) ?? [],
  },
  {
    label: '历史',
    type: 'history',
    items: model.value?.history.map(t=>({...t, type:'user'})) ?? [],
  }
]))
import Toast from "primevue/toast";
import {provide} from 'vue'
import {useToast} from "primevue/usetoast";
import HttpEditorProxy from "./editors/HttpEditorProxy.vue";
import CaptureListMenu from "./CaptureListMenu.vue";
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
const mode = ref();

const unsaved = ref();
watch(mode,(m)=>console.info(m));
</script>

<template>
  <div style="display: flex;flex-direction: column;height:100%">
    <Toast />
    <MainMenu v-model:mode="mode" v-model="current" :unsaved="unsaved"/>
    <div style="display: flex;flex-direction: row;height:100%">
      <Splitter style="height: 100%;width: 100%">
        <SplitterPanel :size="20" style="min-width: 300px">
          <RequestList :requests="mode == 'capture' ? capturedRequests : userRequests" v-model="current"/>
        </SplitterPanel>
        <SplitterPanel :size="80">
          <HttpEditorProxy
            v-if="current"
            v-model="current"
            v-model:mode="mode"
            :requests="mode == 'capture' ? capturedRequests : userRequests"
            v-model:unsaved="unsaved"
          />
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<style scoped>
</style>
