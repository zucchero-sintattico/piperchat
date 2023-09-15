<script setup lang="ts">
import HorizontalUser from './horizontal-component/HorizontalUser.vue'
import HorizontalChannel from './horizontal-component/HorizontalChannel.vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
</script>
<template>
  <q-scroll-area
    class="col bg-secondary fit"
    content-style="position: relative !important"
    content-active-style="position: relative !important"
  >
    <div class="column">
      <div class="col fit">
        <q-list bordered separator class="text-white text-h5">
          <HorizontalChannel name="Directs" icon="chat" />
          <q-list bordered separator class="text-white text-h5" v-for="user in 100" :key="user">
            <HorizontalUser
              :name="user"
              photo=""
              icon="chat"
              @click="userStore.selectedDirect = String(user)"
            />
          </q-list>
        </q-list>
      </div>
    </div>
  </q-scroll-area>
</template>
