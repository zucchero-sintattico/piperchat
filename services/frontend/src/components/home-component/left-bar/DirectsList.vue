<script setup lang="ts">
import HorizontalUser from './horizontal-component/HorizontalUser.vue'
import HorizontalChannel from './horizontal-component/HorizontalChannel.vue'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

const userStore = useUserStore()

const friendTabOpened = ref(true)
const friendTab = ref('friend')
</script>

<template>
  <q-scroll-area visible class="col bg-secondary">
    <div class="column">
      <div class="col">
        <q-list bordered separator class="text-white text-h5">
          <HorizontalChannel
            name="Friends"
            icon="group"
            clickable
            @click="friendTabOpened = true"
          />
          <q-list bordered separator class="text-white text-h5" v-for="user in 10" :key="user">
            <HorizontalUser
              :name="user"
              icon="chat"
              @click="userStore.selectedDirect = String(user)"
            />
          </q-list>
        </q-list>

        <!-- start Friends pop up -->
        <q-dialog v-model="friendTabOpened">
          <q-card style="width: 30vw">
            <q-tabs
              v-model="friendTab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="friend" label="Friends" />
              <q-tab name="request" label="Pending" />
              <q-btn
                icon="group_add"
                class="q-ma-sm bg-green text-white"
                @click="console.log('add')"
              />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="friendTab" animated>
              <q-tab-panel name="friend">
                <div class="text-h4">All friends</div>
                <q-list v-for="user in 10" :key="user">
                  <HorizontalUser name="user" icon="chat" clickable class="q-pa-sm" />
                </q-list>
              </q-tab-panel>

              <q-tab-panel name="request">
                <div class="text-h4">Pending requests</div>
                <q-list v-for="user in 10" :key="user">
                  <HorizontalUser name="user" icon="chat" clickable class="q-pa-sm" />
                </q-list>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </q-dialog>
        <!-- end Friends pop up -->
      </div>
    </div>
  </q-scroll-area>
</template>
