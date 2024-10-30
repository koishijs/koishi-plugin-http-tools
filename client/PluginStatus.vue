<script setup lang="ts">
import {inject} from 'vue';
import {formatSize} from "./size";
import {useRpc} from "@cordisjs/client";

const rpc = useRpc();
const current: any = inject('manager.settings.current')
</script>

<template>
  <div class="flex flex-gap-4 flex-col">
    <div class="flex flex-gap-2">
      <div>HTTP <span style="color:green">GET</span> 请求</div>
      <div> {{ rpc['stats']?.[current.value.path]?.getCount ?? 0 }} 个 ↑{{formatSize(rpc['stats']?.[current.value.path]?.getCount ?? 0)}} ↓{{formatSize(rpc['stats']?.[current.value.path]?.getCount ?? 0)}}</div>
    </div>
    <div class="flex flex-gap-2">
      <div>HTTP <span style="color:red">POST</span> 请求</div>
      <div> {{ rpc['stats']?.[current.value.path]?.postCount ?? 0 }} 个 ↑{{formatSize(rpc['stats']?.[current.value.path]?.postUpload ?? 0)}} ↓{{formatSize(rpc['stats']?.[current.value.path]?.postDownload ?? 0)}}</div>
    </div>

    <div class="flex flex-gap-2">
      <div>HTTP 其他 请求</div>
      <div> {{ rpc['stats']?.[current.value.path]?.otherCount ?? 0 }} 个 ↑{{formatSize(rpc['stats']?.[current.value.path]?.otherUpload ?? 0)}} ↓{{formatSize(rpc['stats']?.[current.value.path]?.otherDownload ?? 0)}}</div>
    </div>
  </div>
</template>

<style scoped>

</style>
