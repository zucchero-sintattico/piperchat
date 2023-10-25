import type { GetChannelByIdApi } from '@api/piperchat/channel'
import type { GetServersApi } from '@api/piperchat/server'
import { ThemesList, type Theme, type FontFamily, FontFamilies } from '@/assets/theme'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export enum SelectedTab {
  Directs = 'directs',
  Servers = 'servers'
}

type Server = GetServersApi.Responses.Server
type Channel = GetChannelByIdApi.Responses.Channel
export const useAppStore = defineStore(
  'app',
  () => {
    // ==================== TABS AND SELECTION ==================== //

    const isInDirects = ref(false)
    const selectedServer: Ref<Server | null> = ref(null)
    const selectedChannel: Ref<Channel | null> = ref(null)
    const selectedDirect: Ref<string | null> = ref(null)
    const inDirectCall: Ref<boolean> = ref(false)

    const isMessageSection = computed(
      () =>
        (selectedDirect.value !== null && !inDirectCall.value) ||
        (selectedChannel.value !== null && selectedChannel.value.channelType !== 'multimedia')
    )

    const isVideoSection = computed(
      () =>
        (selectedChannel.value !== null && selectedChannel.value.channelType == 'multimedia') ||
        (selectedDirect.value !== null && inDirectCall.value)
    )

    function setDirects() {
      isInDirects.value = true
      selectedDirect.value = null
      selectedServer.value = null
      selectedChannel.value = null
      inDirectCall.value = false
    }

    function selectServer(server: Server) {
      selectedServer.value = server
      selectedChannel.value = null
      selectedDirect.value = null
      isInDirects.value = false
      inDirectCall.value = false
    }

    function selectChannel(channel: Channel) {
      selectedChannel.value = channel
    }

    function selectDirect(direct: string) {
      selectedDirect.value = direct
    }

    function unselectChat() {
      selectedChannel.value = null
      selectedDirect.value = null
    }

    function setDirectCall() {
      inDirectCall.value = true
    }

    // ==================== THEME ==================== //
    //Stuffs for Themes
    const DefaultTheme: Theme = {
      label: ThemesList[0].label,
      primary: ThemesList[0].primary,
      secondary: ThemesList[0].secondary,
      accent: ThemesList[0].accent,
      dark: ThemesList[0].dark
    }
    const selectedTheme = ref(DefaultTheme)

    const DefaultFont: FontFamily = { label: FontFamilies[0].label, value: FontFamilies[0].value }
    const selectedFont = ref(DefaultFont)

    return {
      isInDirects,
      setDirects,

      selectedServer,
      selectServer,

      selectedChannel,
      selectChannel,

      selectedDirect,
      selectDirect,

      inDirectCall,
      setDirectCall,

      unselectChat,

      isMessageSection,
      isVideoSection,

      selectedTheme,
      ThemesList,

      selectedFont,
      FontFamilies
    }
  },
  { persist: true }
)
