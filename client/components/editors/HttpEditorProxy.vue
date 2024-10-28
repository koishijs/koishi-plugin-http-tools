<script setup lang="ts">
import {nextTick, ref, watch, provide} from 'vue'
import Skeleton from "primevue/skeleton";
import HttpEditor from "./HttpEditor.vue";
import {send} from '@cordisjs/client'
import {Field} from "minato";

const model = defineModel<{
    id: number,
    type: string,
    stopRefresh?:boolean,
    originalRequest?: number
  }>()

  const props = defineProps<{
    requests: any
  }>();

  const int = ref(false);
  setInterval(()=>int.value = !int.value,1000);

  const data = ref();

  const changed = defineModel<boolean>('unsaved');
  const mode = defineModel<string>('mode');

  const response_data = ref();

  async function fetchData(type:string, id:number, originalRequest?: number){
    const request = await send('http/request',{type, id: id});
    response_data.value = null;
    if(originalRequest){
      data.value = await send('http/request', {type: 'user', id:originalRequest});
    }else data.value = null;
    if(request){
      if(!data.value)
        data.value = request;
      else
        response_data.value = request;
      nextTick(()=>{
        changed.value = false;
      });
    }
  }

  watch(model,(val, oldVal)=>{


    if(val?.type == oldVal?.type && val?.id == oldVal?.id){
      return;
    }

    if(val.stopRefresh){
      val.stopRefresh = false;
      return;
    }

    if(!val)
      return;

    const realRequestId = val.originalRequest ?? val.id;
    const realRequestType = val.originalRequest ? 'user' : val.type;

    const oldRequestId = oldVal?.originalRequest ?? oldVal?.id;
    const oldRequestType = oldVal?.originalRequest ? 'user' : oldVal?.type;

    /* if(realRequestId == oldRequestId && realRequestType == oldRequestType){
      return;
    } */

    data.value = null;

    fetchData(val.type, val.id, val.originalRequest);
  },{immediate:true})

  watch(data,()=>{
    changed.value = true;
  },{deep:true})

  watch(props,(props)=>{
    const request = props.requests;
    const category = request.find(category=>category.type == model.value.type);
    if(!category){
      model.value = null;
      return;
    }
    const req = category.items.find(req=>req.id == model.value.id);
    if(!req){
      model.value = null;
      return;
    }
  })

  let savingTimeout : NodeJS.Timeout | number | false = false;


  watch(changed,(value)=>{
    if(value && savingTimeout === false){
      savingTimeout = setTimeout(()=>{
        savingTimeout = false;
        changed.value = false;
        save();
      }, 3000);
    }else if(!value && savingTimeout !== false){
      clearTimeout(savingTimeout);
      savingTimeout = false;
    }
  })

  async function save(){
    if(!data.value)
      return;
    if(model.value.type != 'user' && !model.value.originalRequest){
      const request = await send('http/request.create', data.value);
      if(!request){
        alert("保存失败!");
        changed.value = true;
      }else{
        mode.value = 'test';
        model.value = { id:request, type: 'user' };
      }
    } else {
      const request = await send('http/request.save', {
        ...data.value,
        ...(model.value.originalRequest ? {
          id: model.value.originalRequest
        } : {})
      });
    }
  }
  provide('setRequestModel', (request:{id:number, type:string})=>{
    model.value = request;
  })

  defineExpose({
    save(){
      return save();
    }
  })
</script>

<template>
  <HttpEditor v-if="data" v-model:request="data" :response="response_data ?? data" v-model:identifier="model"/>
  <div style="flex:1;display: flex;flex-direction: column" v-else>
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
