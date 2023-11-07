<script setup lang="ts">
import { initializeUniformMeshSDK } from '@uniformdev/mesh-sdk'

const meshSdk = await initializeUniformMeshSDK()
const location = meshSdk?.getCurrentLocation<any, any>()

// console.log({ meshSdk, location })
// if (!location) throw createError({ statusCode: 501 })
</script>

<template>
  <h1>Config</h1>

  <h2>Presets</h2>

  <Presets
    :model-value="location?.value?.presets"
    @update:model-value="location?.setValue({ presets: $event })"
  />
</template>
