import type { Socket } from 'socket.io-client'

type UserJoinCallback = (username: string, stream: MediaStream) => void
type UserLeaveCallback = (username: string) => void

export interface ChannelCallHandler {
  start(myStream: MediaStream, onUserJoin: UserJoinCallback, onUserLeave: UserLeaveCallback): void
}

const WebRtcConfiguration: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:localhost:3478'
    },
    {
      urls: 'turn:localhost:5349',
      username: 'coturn',
      credential: 'coturn-password'
    }
  ]
}

export class ChannelCallHandlerImpl implements ChannelCallHandler {
  private serverId: string
  private channelId: string
  private socket: Socket

  private myStream?: MediaStream
  private onUserJoin?: UserJoinCallback
  private onUserLeave?: UserLeaveCallback

  private peers: Record<string, RTCPeerConnection> = {}

  constructor(socket: Socket, serverId: string, channelId: string) {
    this.socket = socket
    this.serverId = serverId
    this.channelId = channelId
  }

  start(myStream: MediaStream, onUserJoin: UserJoinCallback, onUserLeave: UserLeaveCallback): void {
    this.myStream = myStream
    this.onUserJoin = onUserJoin
    this.onUserLeave = onUserLeave
    this.setupProtocolListener()
    this.socket.emit('join-channel', this.serverId, this.channelId)
  }

  private setupProtocolListener() {
    this.socket.on('user-connected', (username: string) => this.onUserConnected(username))
    this.socket.on('user-disconnected', (username: string) => this.onUserDisconnected(username))
    this.socket.on('offer', (offer: RTCSessionDescriptionInit, from: string) =>
      this.onOffer(offer, from)
    )
    this.socket.on('answer', (answer: RTCSessionDescriptionInit, from: string) =>
      this.onAnswer(answer, from)
    )
    this.socket.on('ice-candidate', (candidate: RTCIceCandidate, from: string) =>
      this.onIceCandidate(candidate, from)
    )
  }

  private async onUserConnected(username: string) {
    this.peers[username] = new RTCPeerConnection(WebRtcConfiguration)

    this.myStream?.getTracks().forEach((track) => {
      this.peers[username].addTrack(track, this.myStream!)
    })

    this.peers[username].ontrack = (event) => {
      this.onUserJoin?.(username, event.streams[0])
    }

    const offer = await this.peers[username].createOffer()
    await this.peers[username].setLocalDescription(offer)

    this.socket.emit('offer', username, offer)

    this.peers[username].onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', username, event.candidate)
      }
    }
  }

  private async onUserDisconnected(username: string) {
    this.onUserLeave?.(username)
    this.peers[username].close()
    delete this.peers[username]
  }

  private async onOffer(offer: RTCSessionDescriptionInit, from: string) {
    this.peers[from] = new RTCPeerConnection(WebRtcConfiguration)
    this.peers[from].ontrack = (event) => {
      this.onUserJoin?.(from, event.streams[0])
    }
    this.peers[from].onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', from, event.candidate)
      }
    }
    this.myStream?.getTracks().forEach((track) => {
      this.peers[from].addTrack(track, this.myStream!)
    })
    await this.peers[from].setRemoteDescription(offer)
    const answer = await this.peers[from].createAnswer()
    await this.peers[from].setLocalDescription(answer)
    this.socket.emit('answer', answer, from)
  }

  private async onAnswer(answer: RTCSessionDescriptionInit, from: string) {
    await this.peers[from].setRemoteDescription(answer)
  }

  private async onIceCandidate(candidate: RTCIceCandidate, from: string) {
    await this.peers[from].addIceCandidate(candidate)
  }
}
