<script setup lang="ts">
import {computed} from 'vue'
const model = defineModel<any>()

const body = computed(()=>atob(model.value?.responseBody))
</script>

<template>
  <div>
    {{ body }}123
  </div>
</template>

<style scoped>

</style>
