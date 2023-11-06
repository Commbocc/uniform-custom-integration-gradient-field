<script setup lang="ts">
import { initializeUniformMeshSDK } from '@uniformdev/mesh-sdk'
import { compileString } from 'sass'

interface ColorModel {
  color: string
  opacity: number
}

interface StateModel {
  angle?: number
  colors?: ColorModel[]
  compiledValue?: string
}

const meshSdk = await initializeUniformMeshSDK()
const location = meshSdk?.getCurrentLocation<any, any>()

// if (!location) throw createError({ statusCode: 501 })

const state = reactive<StateModel>(
  location?.value ?? {
    angle: 0,
    colors: [],
    compiledValue: '',
  }
)

const rgbs = computed(() => {
  return state.colors?.map((m) => `rgba(${m.color}, ${m.opacity}%)`).join(', ')
})

const save = () => {
  state.compiledValue = compiledValue.value
  location?.setValue(toRaw(state))
}

watch(() => [state.angle, state.colors], save, {
  deep: true,
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

const removeColor = (i: number) => {
  state.colors?.splice(i, 1)
}
</script>

<template>
  <div class="ratio ratio-16x9" :style="{ background: compiledValue }"></div>

  <!-- <pre>{{ location?.value }}</pre> -->

  <!-- angle -->
  <div class="my-3">
    <label for="angle" class="form-label">Gradient Angle</label>

    <input
      id="angle"
      type="range"
      min="0"
      max="360"
      v-model="state.angle"
      class="form-control"
    />
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
