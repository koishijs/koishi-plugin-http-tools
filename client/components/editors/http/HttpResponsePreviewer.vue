<script setup lang="ts">
import {ref,computed,watch} from "vue";
import Menu from "primevue/menu";
import {MenuItem} from "primevue/menuitem";
import History from "./response/History.vue";


const identifier = defineModel<any>('identifier');

const current = ref(identifier.value.type != 'capture' ? "history" : 'header');

const menuData = computed(()=>(
  [
    ...(identifier.value.type != 'capture' ? [{
      label: '历史记录',
      icon: 'pi pi-history',
      name: 'history'
    }] : []),
    {
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
  ]
));
const items = computed(
  () => menuData.value.map(entry=>current.value == entry.name ? {...entry,class: 'k-h-active'} : {
    ...entry,
    command: ()=>current.value = entry.name
  }));
</script>

<template>
  <div class="flex" style="height: 100%">
    <Menu :model="items" style="height: 100%; border-left: none;border-top:none;border-bottom: none;border-radius: 0">
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
          <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
        </a>
      </template>
    </Menu>
    <div class="flex-1">
      <History v-if="current == 'history'"/>
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
