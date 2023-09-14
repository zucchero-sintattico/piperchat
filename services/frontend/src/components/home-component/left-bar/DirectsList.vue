<script setup lang="ts">
import HorizontalUser from './horizontal-component/HorizontalUser.vue'
import HorizontalChannel from './horizontal-component/HorizontalChannel.vue'
import { ContentArea, useUserStore } from '@/stores/user'
const userStore = useUserStore()

function setActiveDirect(directUsarname: string) {
  userStore.inContentArea = ContentArea.Direct
  userStore.selectedDirect = directUsarname
}
</script>
<template>
  <q-scroll-area visible class="col bg-secondary">
    <div class="column">
      <div class="col">
        <q-list bordered separator class="text-white text-h5">
          <HorizontalChannel name="Directs" icon="chat" />
          <q-list bordered separator class="text-white text-h5" v-for="user in 10" :key="user">
            <HorizontalUser
              :name="user"
              photo=""
              icon="chat"
              @click="setActiveDirect(user.toString())"
            />
          </q-list>
        </q-list>
      </div>
    </div>
  </q-scroll-area>
</template>
