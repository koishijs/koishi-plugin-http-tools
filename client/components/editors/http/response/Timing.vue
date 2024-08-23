<script setup lang="ts">
  const model = defineModel<any>();
</script>

<template>
  <div style="padding: 20px">
    请求耗时: {{ model?.endTime - model?.startTime }} ms
  </div>
</template>

<style scoped>

</style>
