<script setup lang="ts">
const meshSdk = await useUniformMesh()
const location = meshSdk?.getCurrentLocation<any, any>()
// console.log({ meshSdk, location })
</script>

<template>
  <h1>Config</h1>

  <h2>Presets</h2>

  <Presets
    :model-value="location?.value?.presets"
    @update:model-value="location?.setValue({ presets: $event })"
  />
</template>
