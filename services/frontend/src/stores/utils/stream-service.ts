import { ref, type Ref } from 'vue'

export class StreamService {
  constraints: MediaStreamConstraints
  stream: Ref<MediaStream | undefined> = ref(undefined)
  mic_on = ref(false)
  cam_on = ref(false)

  constructor(constraints: MediaStreamConstraints) {
    this.constraints = constraints
    this.mic_on.value = (constraints.audio as boolean) || false
    this.cam_on.value = (constraints.video as boolean) || false
  }

  async start() {
    this.stream.value = await navigator.mediaDevices.getUserMedia(this.constraints)
    this.mic_on.value = (this.constraints.audio as boolean) || false
    this.cam_on.value = (this.constraints.video as boolean) || false
  }

  async stop() {
    this.stream.value?.getTracks().forEach((track) => track.stop())
  }

  async toggleAudio() {
    this.stream?.value?.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
    this.mic_on.value = !this.mic_on.value
  }

  async toggleVideo() {
    this.stream?.value?.getVideoTracks().forEach((track) => (track.enabled = !track.enabled))
    this.cam_on.value = !this.cam_on.value
  }
}
