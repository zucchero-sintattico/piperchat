<script setup lang="ts">
import HorizontalUser from './horizontal-component/HorizontalUser.vue'
import { computed, onMounted, ref } from 'vue'
import { useFriendStore } from '@/stores/friend'

const friendStore = useFriendStore()

const BANNER_TIMEOUT = 3000

const props = defineProps(['active'])
const emit = defineEmits(['update:active'])

const active = computed({
  get() {
    return props.active
  },
  set() {
    emit('update:active')
  }
})

const friendTab = ref('friend')
const friendRequestPopup = ref(false)
const friendUsername = ref('')

enum Banner {
  OK = 'bg-green',
  ERROR = 'bg-red',
  WARNING = 'bg-orange'
}

const resultBanner = ref(false)
const colorBanner = ref(Banner.OK)
const contentBanner = ref('')

function popUpBanner() {
  resultBanner.value = true
  setTimeout(() => {
    resultBanner.value = false
  }, BANNER_TIMEOUT)
}

async function sendFriendRequest() {
  await friendStore.sendFriendRequest(
    friendUsername.value,
    () => {
      colorBanner.value = Banner.OK
      contentBanner.value = 'Friend request sent'
      resultBanner.value = true
    },
    (e) => {
      colorBanner.value = Banner.ERROR
      contentBanner.value = e
    }
  )
  popUpBanner()
  friendUsername.value = ''
  friendRequestPopup.value = false
}

async function acceptRequest(sender: string) {
  await friendStore.acceptFriendRequest(
    sender,
    () => {
      colorBanner.value = Banner.OK
      contentBanner.value = 'Friend request accepted'
      resultBanner.value = true
    },
    (e) => {
      colorBanner.value = Banner.ERROR
      contentBanner.value = e
    }
  )
  popUpBanner()
}

async function denyRequest(sender: string) {
  await friendStore.denyFriendRequest(
    sender,
    () => {
      colorBanner.value = Banner.WARNING
      contentBanner.value = 'Friend request denied'
      resultBanner.value = true
    },
    (e) => {
      colorBanner.value = Banner.ERROR
      contentBanner.value = e
    }
  )
  popUpBanner()
}

onMounted(async () => {
  friendStore.fetchFriendRequest()
})
</script>

<template>
  <div>
    <!-- start Friends pop up -->
    <q-dialog v-model="active">
      <q-card class="container">
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
            @click="friendRequestPopup = true"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="friendTab" animated>
          <q-tab-panel name="friend">
            <div class="text-h4">All friends</div>
            <q-list v-for="friend in friendStore.friends" :key="friend">
              <HorizontalUser :name="friend" icon="chat" clickable class="q-pa-sm" />
            </q-list>
          </q-tab-panel>

          <q-tab-panel name="request">
            <div class="text-h4">Pending requests</div>
            <q-list v-for="sender in friendStore.pendingRequests" :key="sender">
              <q-item>
                <q-item-section>
                  <HorizontalUser :name="sender" icon="chat" class="q-pa-sm" />
                </q-item-section>

                <!-- start Accept button -->
                <q-btn
                  style="width: fit-content"
                  icon="check"
                  class="bg-green text-white"
                  @click="acceptRequest(sender)"
                />
                <!-- end Accept button -->

                <!-- start Deny button -->
                <q-btn
                  style="width: fit-content"
                  icon="close"
                  class="bg-red text-white"
                  @click="denyRequest(sender)"
                />
                <!-- start Deny button -->
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>
    <!-- end Friends pop up -->

    <!-- start Friend request pop up -->
    <q-dialog v-model="friendRequestPopup" persistent>
      <q-card class="friend-popup">
        <q-card-section>
          <div class="text-h6">Insert friend name</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            label="Friend username"
            type="text"
            v-model="friendUsername"
            autofocus
            @keyup.enter="sendFriendRequest"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup @click="friendUsername = ''" />
          <q-btn color="primary" label="Send friend request" @click="sendFriendRequest" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- end Friend request pop up -->

    <!-- start Request Ok -->
    <q-dialog v-model="resultBanner" seamless position="bottom">
      <q-card :class="colorBanner" class="text-h6 text-white q-px-xl q-py-md">
        {{ contentBanner }}
      </q-card>
    </q-dialog>
    <!-- end Request Ok -->
  </div>
</template>

<style scoped>
.container {
  min-width: 30vw;
}

.friend-popup {
  min-width: 20vw;
}

@media screen and (max-width: 1200px) {
  .container {
    min-width: 80vw;
  }

  .friend-popup {
    min-width: 60vw;
  }
}
</style>
