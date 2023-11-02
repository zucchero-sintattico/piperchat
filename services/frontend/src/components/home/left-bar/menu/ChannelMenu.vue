<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useServerStore } from '@/stores/server'
import BottomPopUp from '@/components/utils/BottomPopUp.vue'
import { BannerColor } from '@/components/utils/BannerColor'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const serverStore = useServerStore()

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

const BANNER_TIMEOUT = 3000
const resultBanner = ref(false)
const colorBanner = ref(BannerColor.OK)
const contentBanner = ref('')
function popUpBanner(content: string, color: BannerColor) {
  contentBanner.value = content
  colorBanner.value = color
  resultBanner.value = true
  setTimeout(() => {
    resultBanner.value = false
  }, BANNER_TIMEOUT)
}

function validateText(text: string) {
  // check if is emt or only white space
  return text.trim().length > 0
}

const updatedChannelInfo = ref({ name: '', description: '' })
async function updateChannelName(channelName: string) {
  if (!validateText(channelName)) {
    popUpBanner('Channel name cannot be empty', BannerColor.ERROR)
    return
  }
  try {
    await serverStore.updateChannel(
      appStore.selectedServer!.id,
      appStore.selectedChannel!.id,
      channelName
    )
    popUpBanner('Channel name updated', BannerColor.OK)
    console.log(appStore.selectChannel?.name)
  } catch (error) {
    popUpBanner(String(error), BannerColor.ERROR)
  }
}
async function updateChannelDescription(channelDescription: string) {
  if (!validateText(channelDescription)) {
    popUpBanner('Channel description cannot be empty', BannerColor.ERROR)
    return
  }
  try {
    await serverStore.updateChannel(
      appStore.selectedServer!.id,
      appStore.selectedChannel!.id,
      undefined,
      channelDescription
    )
    popUpBanner('Channel description updated', BannerColor.OK)
  } catch (error) {
    popUpBanner(String(error), BannerColor.ERROR)
  }
}

watch(
  () => appStore.selectedChannel,
  () => {
    console.log('selected channel changed')
    updatedChannelInfo.value.name = appStore.selectedChannel?.name as string
    updatedChannelInfo.value.description = appStore.selectedChannel?.description as string
  }
)
onMounted(() => {
  updatedChannelInfo.value.name = appStore.selectedChannel?.name as string
  updatedChannelInfo.value.description = appStore.selectedChannel?.description as string
})
</script>

<template>
  <div>
    <!-- start Channel pop up -->
    <q-dialog v-model="active">
      <q-card class="container">
        <q-tabs
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="info" label="Info" />
        </q-tabs>

        <q-separator />
        <q-tab-panel name="info">
          <div class="text-h4">Channel Info</div>
          <div class="row">
            <div class="text-h6 q-pa-sm">Name:</div>
            <!-- make readonly if the user is't the owner -->
            <q-input
              v-model="updatedChannelInfo.name"
              label="Channel name"
              outlined
              class="q-mb-md"
              :readonly="!serverStore.amITheOwner"
            />
            <q-btn
              label="Save"
              color="primary"
              class="q-mb-md"
              v-if="serverStore.amITheOwner"
              @click="updateChannelName(updatedChannelInfo.name)"
            />
          </div>
          <div class="row">
            <div class="text-h6 q-pa-sm">Type:</div>
            <div class="text-to-copy q-pa-sm text-h6">
              {{ appStore.selectedChannel?.channelType }}
            </div>
          </div>
          <div class="row">
            <div class="text-h6 q-pa-sm">Description:</div>
            <q-input
              v-model="updatedChannelInfo.description"
              label="Channel description"
              outlined
              class="q-mb-md"
              type="textarea"
              :readonly="!serverStore.amITheOwner"
            />
            <!-- submit button -->
            <q-btn
              label="Save"
              color="primary"
              class="q-mb-md"
              v-if="serverStore.amITheOwner"
              @click="updateChannelDescription(updatedChannelInfo.description)"
            />
          </div>
        </q-tab-panel>
      </q-card>
    </q-dialog>

    <BottomPopUp v-model:active="resultBanner" :content="contentBanner" :color="colorBanner" />
  </div>
</template>

<style scoped lang="scss">
.container {
  min-width: 30vw;
}

.text-to-copy {
  border-radius: 10px !important;
  font-family: monospace !important;
}

@media screen and (max-width: 1200px) {
  .container {
    min-width: 80vw;
  }
}
</style>
