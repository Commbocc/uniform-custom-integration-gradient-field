<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'

const props = defineProps<{
  modelValue?: GradientModel[]
  debounce?: number
  maxWait?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: GradientModel[]): void
}>()

const state = reactive<GradientModel[]>(props.modelValue ?? [])
const confirmRemoveIndices = ref<number[]>([])

watchDebounced(
  state,
  () => {
    emit('update:modelValue', toRaw(state))
  },
  {
    deep: true,
    debounce: props.debounce ?? 500,
    maxWait: props.maxWait ?? 1000,
  }
)

const removePreset = (i: number) => {
  state?.splice(i, 1)
  const indexOfCri = confirmRemoveIndices.value.indexOf(i)
  confirmRemoveIndices.value?.splice(indexOfCri, 1)
}
</script>

<template>
  <details v-for="(preset, i) in state" class="my-3">
    <summary
      class="bg-light p-3 d-flex align-items-center justify-content-between"
    >
      <span>
        {{ !!preset.name ? preset.name : `Preset ${i + 1}` }}
      </span>

      <div class="d-flex align-items-center">
        <input
          v-model="confirmRemoveIndices"
          :value="i"
          type="checkbox"
          class="form-check-input"
        />

        <button
          :disabled="!confirmRemoveIndices.includes(i)"
          @click="removePreset(i)"
          class="btn btn-sm btn-outline-danger ms-2"
        >
          Remove
        </button>
      </div>
    </summary>
    <Gradient v-model="state[i]" edit-name />
  </details>

  <hr />

  <div class="my-3">
    <button
      @click="state.push({ angle: 0, colors: [] })"
      class="btn btn-primary"
    >
      Add Preset
    </button>
  </div>
</template>
