<script setup lang="ts">
  import {ref,watch,nextTick} from 'vue'
  import ProgressSpinner from "primevue/progressspinner";
  import Skeleton from "primevue/skeleton";
  import HttpEditor from "./HttpEditor.vue";
  import {send} from '@cordisjs/client'
  const props = defineProps<{
    id: number,
    type: string
  }>()

  const int = ref(false);
  setInterval(()=>int.value = !int.value,1000);

  const data = ref();

  const changed = ref(false);

  async function fetchData(type:string, id:number){
    const response = await send('http/request',{type, id});
    if(response){
      data.value = response;
      nextTick(()=>{
        changed.value = false;
      });
    }
  }

  watch(props,(val)=>{
    data.value = null;
    fetchData(val.type, val.id);
  },{immediate:true})

  watch(data,()=>{
    console.info("Updated")
    changed.value = true;
  },{deep:true})

  let savingTimeout : NodeJS.Timeout | number | false = false;
  watch(changed,(value)=>{
    if(value && savingTimeout === false){
      savingTimeout = setTimeout(()=>{
        console.info("Save");
        savingTimeout = false;
        changed.value = false;
      }, 3000);
    }else if(!value && savingTimeout !== false){
      clearTimeout(savingTimeout);
      savingTimeout = false;
    }
  })
</script>

<template>
  <HttpEditor v-if="data" v-model="data"/>
  <div style="height:100%;width: 100%;display: flex;flex-direction: column" v-else>
    <div style="display: flex;flex-direction: column;gap: 5px">
      <div style="padding: 8px 20px;">
        <Skeleton height="2.5rem" width="100%"></Skeleton>
      </div>
    </div>
    <div style="padding-left: 20px;padding-top:0.4rem">
      <Skeleton height="1rem" width="24rem" borderRadius="16px"></Skeleton>
    </div>
    <Skeleton height="2.5rem" width="16rem" style="margin-top:1rem;margin-left:1.4rem"></Skeleton>
    <div style="margin: 1.4rem;flex:1">
      <Skeleton height="100%" width="100%"/>
    </div>
  </div>
</template>

<style scoped>

</style>
