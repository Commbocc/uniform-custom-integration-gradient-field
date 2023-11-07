<script setup lang="ts">
import { compileString } from 'sass'
import { watchDebounced } from '@vueuse/core'

const props = defineProps<{
  modelValue: GradientModel
  editName?: boolean
  debounce?: number
  maxWait?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: GradientModel): void
}>()

const state = reactive<GradientModel>(props.modelValue)

const rgbs = computed(() => {
  return state.colors?.map((m) => `rgba(${m.color}, ${m.opacity}%)`).join(', ')
})

const compiledValue = computed(() => {
  if (!state.colors?.length) return ''

  const value =
    state.colors.length > 1
      ? `linear-gradient(${state.angle}deg, ${rgbs.value})`
      : rgbs.value

  const { css } = compileString(`.bg { background: ${value}; }`)
  return css.match(/background\: (.*)\;/)?.[1] ?? 'undefined'
})

watchDebounced(
  () => [state.name, state.angle, state.colors],
  () => {
    state.compiledValue = compiledValue.value
    emit('update:modelValue', toRaw(state))
  },
  {
    deep: true,
    debounce: props.debounce ?? 500,
    maxWait: props.maxWait ?? 1000,
  }
)

const removeColor = (i: number) => {
  state.colors?.splice(i, 1)
}
</script>

<template>
  <div id="preview" class="border">
    <div class="ratio ratio-16x9" :style="{ background: compiledValue }"></div>
  </div>

  <details>
    <pre>{{ state }}</pre>
  </details>

  <!-- name -->
  <div v-if="editName" class="my-3">
    <label for="name" class="form-label">Gradient Name</label>

    <input id="name" type="text" v-model="state.name" class="form-control" />
  </div>

  <!-- angle -->
  <div class="my-3">
    <label for="angle" class="form-label">Gradient Angle</label>

    <div class="row">
      <div class="col-8">
        <input
          id="angle"
          type="range"
          min="0"
          max="360"
          v-model="state.angle"
          class="form-control"
        />
      </div>
      <div class="col-4">
        <input
          type="number"
          min="0"
          max="360"
          v-model="state.angle"
          class="form-control form-control-sm"
        />
      </div>
    </div>
  </div>

  <!-- colors -->
  <table class="table table-striped">
    <thead>
      <tr>
        <th width="33%">Color</th>
        <th width="50%">Opacity</th>
        <th>Remove</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(model, i) in state.colors">
        <td>
          <input type="color" v-model="model.color" class="form-control" />
        </td>
        <td>
          <input
            type="range"
            :min="0"
            :max="100"
            v-model="model.opacity"
            class="form-control form-control-sm"
          />
        </td>
        <td>
          <div class="d-grid gap-0">
            <button
              @click="removeColor(i)"
              class="btn btn-outline-danger btn-sm"
              title="Remove"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x-circle"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                />
                <path
                  d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <button
    @click="state.colors?.push({ color: '#ff0000', opacity: 50 })"
    class="btn btn-primary"
  >
    Add Color
  </button>
</template>

<style>
#preview {
  background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
    linear-gradient(-45deg, #808080 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #808080 75%),
    linear-gradient(-45deg, transparent 75%, #808080 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
</style>
