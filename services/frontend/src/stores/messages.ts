import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMessageStore = defineStore(
  'message',
  () => {
    // array of message
    const messages = ref({
      data: [
        {
          sender: 'me',
          content: 'ciao',
          timestamp: '2021-05-01T12:00:00.000Z',
          sent: true
        },
        {
          sender: 'you',
          content: 'ciao',
          timestamp: '2021-05-01T12:00:00.000Z',
          sent: false
        }
      ]
    })

    async function sendMessage(sender: string, content: string) {
      messages.value.data.push({
        sender: sender,
        content: content,
        timestamp: new Date().toISOString(),
        sent: true
      })
    }

    return {
      messages,
      sendMessage
    }
  },
  { persist: true }
)
