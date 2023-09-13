import { name, description } from './NewServerForm.vue'

export function onReset() {
  name.value = ''
  description.value = ''
  $emit('close')
}
