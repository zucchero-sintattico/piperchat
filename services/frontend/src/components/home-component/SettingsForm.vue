<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'
import { setCssVar } from 'quasar'

const userStore = useUserStore()

const event = defineEmits<{
  (e: 'close'): void
}>()

onMounted(async () => {
  await userStore.reloadUserPhoto()
})

function handleFileChange(e: any) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      userStore.updatePhoto(reader.result as string)
    }
    reader.readAsArrayBuffer(file)
  }
}

function openFileInput() {
  const input = document.getElementById('fileInput')
  input?.click()
}

function updateTheme() {
  setCssVar('primary', userStore.selectedTheme.primary)
  setCssVar('secondary', userStore.selectedTheme.secondary)
  setCssVar('accent', userStore.selectedTheme.accent)
  setCssVar('dark', userStore.selectedTheme.dark)
}
</script>

<template>
  <div class="q-pa-xl bg-white">
    <q-form class="q-gutter-md">
      <!--Insert image with username-->
      <div class="avatar-and-title">
        <q-avatar class="q-mb-md" size="100px" @click="openFileInput">
          <img v-if="userStore.photoLoaded" :src="userStore.photo" />
        </q-avatar>
        <input id="fileInput" type="file" style="display: none" accept="image/*" @change="handleFileChange" />
        <h3 style="margin-left: 10px">{{ userStore.username }}</h3>
      </div>

      <q-input :model-value="userStore.username" label="Username" outlined class="q-mb-md" />

      <q-input :model-value="userStore.email" label="Email" outlined class="q-mb-md" />

      <q-select outlined v-model="userStore.selectedTheme" :options="userStore.ThemesList" label="Theme"
        @update:model-value="updateTheme()" />

      <q-btn label="Cancel" type="reset" color="primary" flat class="q-ml-sm q-mt-md" @click="event('close')" />
    </q-form>
  </div>
</template>
