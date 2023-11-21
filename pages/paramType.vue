<script setup lang="ts">
const meshSdk = await useUniformMesh()
const location = meshSdk?.getCurrentLocation<any, any>()
// console.log({ meshSdk, location })

const state = ref<GradientModel>(
  location?.value ?? {
    angle: 0,
    colors: [],
    cssValue: '',
    gradientValue: '',
  }
)

watch(
  () => state.value.cssValue,
  () => {
    // console.log('saving')
    location?.setValue(toRaw(state.value))
  }
)

const enablePresets = ref(false)

const presets = computed<GradientModel[]>(() => {
  return [
    // @ts-ignore
    ...(location?.metadata.parameterConfiguration?.presets ?? []),
    // @ts-ignore
    ...(location?.metadata?.settings?.presets ?? []),
  ]
})

const setPreset = (event: any) => {
  if (!event.target.value) return
  const preset = presets.value[event.target.value]
  Object.assign(state.value, toRaw(preset))
}
</script>

<template>
  <div v-if="presets.length" class="mb-3">
    <input
      v-model="enablePresets"
      type="checkbox"
      id="enablePresets"
      class="form-check-input me-2"
    />

    <label for="enablePresets">Load Preset</label>

    <select
      :disabled="!enablePresets"
      @change="setPreset"
      class="form-select mt-1"
    >
      <option :value="undefined">- Select Preset</option>
      <option v-for="(preset, i) in presets" :value="i">
        {{ preset.name }}
      </option>
    </select>
  </div>

  <Gradient v-model="state" />
</template>
