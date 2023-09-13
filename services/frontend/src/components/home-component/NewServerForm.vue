<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const description = ref('')

function onSubmit() {}

function onReset() {
  name.value = ''
  description.value = ''
}
</script>

<template>
  <div class="q-pa-xl bg-white">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <h2 class="text-h3">Create a new server</h2>

      <q-input
        filled
        v-model="name"
        label="Server name"
        hint="Name of your server"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        v-model="description"
        label="Server description"
        hint="Description of your server"
        lazy-rules
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Cancel"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
          @click="$emit('close')"
        />
      </div>
    </q-form>
  </div>
</template>
