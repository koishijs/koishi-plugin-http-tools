<script setup lang="ts">
import {ref,computed,watch} from "vue";
import Menu from "primevue/menu";
import {MenuItem} from "primevue/menuitem";
import History from "./response/History.vue";
import StackTrace from "./response/StackTrace.vue";
import ResponseHeader from "./response/ResponseHeader.vue";
import ScrollPanel from "primevue/scrollpanel";
import ResponseBody from "./response/ResponseBody.vue";
import Timing from "./response/Timing.vue";

const model = defineModel();

const identifier = defineModel<any>('identifier');

const isUser = computed(()=>identifier.value.type != 'capture' || identifier.value.originalRequest);

const current = ref(isUser.value ? "history" : 'header');

const hasChildren = ref(false);

const hasChildrenComputed = computed(()=>hasChildren.value || identifier.value.type == 'capture')

const menuData = computed(()=>(
  [
    ...(isUser.value ? [{
      label: '历史记录',
      icon: 'pi pi-history',
      name: 'history'
    }] : []),
    ...(hasChildrenComputed.value ? [{
      label: '响应头',
      icon: 'pi pi-inbox',
      name: 'header'
    },
    {
      label: '响应体',
      icon: 'pi pi-file',
      name: 'body'
    },
    {
      label: '计时',
      icon: 'pi pi-clock',
      name: 'timing'
    },
    {
      label: '堆栈追踪',
      icon: 'pi pi-align-justify',
      name: 'stack'
    }
  ] : [])

  ]));
const items = computed(
  () => menuData.value.map(entry=>current.value == entry.name ? {...entry,class: 'k-h-active'} : {
    ...entry,
    command: ()=>current.value = entry.name
  }));
</script>

<template>
  <div class="flex" style="flex:1">
    <Menu :model="items" style="height: 100%; border-left: none;border-top:none;border-bottom: none;border-radius: 0">
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
          <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
        </a>
      </template>
    </Menu>
    <div class="flex-1 flex">
      <div style="height: 100%;width: 100%">
        <ScrollPanel style="height: 100%;width: 100%">
          <ResponseHeader v-if="current == 'header' && hasChildrenComputed" v-model="model"/>
          <ResponseBody v-else-if="current == 'body' && hasChildrenComputed" v-model="model"/>
          <History v-else-if="current == 'history'" :identifier="identifier" :response="model" v-model:historySelected="hasChildren"/>
          <StackTrace v-else-if="current == 'stack' && hasChildrenComputed" v-model="model"/>
          <Timing v-else-if="current == 'timing' && hasChildrenComputed" v-model="model"/>
        </ScrollPanel>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

<style>
.k-h-active .p-menu-item-content{
  background: var(--p-listbox-option-selected-background)!important;
}
</style>
