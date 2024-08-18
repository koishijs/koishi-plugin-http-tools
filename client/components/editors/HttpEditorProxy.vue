<script setup lang="ts">
  import {ref,watch,nextTick,defineExpose,defineEmits} from 'vue'
  import ProgressSpinner from "primevue/progressspinner";
  import Skeleton from "primevue/skeleton";
  import HttpEditor from "./HttpEditor.vue";
  import {send} from '@cordisjs/client'
  import {Field} from "minato";
  import boolean = Field.boolean;

  const model = defineModel<{
    id: number,
    type: string,
    stopRefresh?:boolean
  }>()

  const props = defineProps<{
    requests: any
  }>();

  const int = ref(false);
  setInterval(()=>int.value = !int.value,1000);

  const data = ref();

  const changed = defineModel<boolean>('unsaved');
  const mode = defineModel<string>('mode');

  async function fetchData(type:string, id:number){
    const response = await send('http/request',{type, id});
    if(response){
      data.value = response;
      nextTick(()=>{
        changed.value = false;
      });
    }
  }

  watch(model,(val)=>{
    if(val.stopRefresh){
      val.stopRefresh = false;
      return;
    }
    data.value = null;
    if(!val)
      return;
    fetchData(val.type, val.id);
  },{immediate:true})

  watch(data,()=>{
    changed.value = true;
  },{deep:true})

  watch(props,(props)=>{
    const request = props.requests;
    console.info("Request update")
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
    if(model.value.type != 'user'){
      const request = await send('http/request.create', data.value);
      if(!request){
        alert("保存失败!");
        changed.value = true;
      }else{
        mode.value = 'test';
        model.value = { id:request, type: 'user', stopRefresh:true};
      }
    } else {
      const request = await send('http/request.save', data.value);

    }
  }
</script>

<template>
  <HttpEditor v-if="data" v-model="data" v-model:identifier="model"/>
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
