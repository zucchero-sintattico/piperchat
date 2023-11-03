import type { Socket } from 'socket.io-client'

type UserJoinCallback = (username: string, stream: MediaStream) => void
type UserLeaveCallback = (username: string) => void

export interface SessionHandler {
  start(myStream: MediaStream, onUserJoin: UserJoinCallback, onUserLeave: UserLeaveCallback): void
  stop(): void
}

const WebRtcConfiguration: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:global.stun.twilio.com:3478'
    },
    {
      username: 'dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269',
      credential: 'tE2DajzSJwnsSbc123',
      urls: 'turn:global.turn.twilio.com:3478?transport=udp'
    },
    {
      username: 'dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269',
      credential: 'tE2DajzSJwnsSbc123',
      urls: 'turn:global.turn.twilio.com:3478?transport=tcp'
    },
    {
      username: 'dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269',
      credential: 'tE2DajzSJwnsSbc123',
      urls: 'turn:global.turn.twilio.com:443?transport=tcp'
    }
  ]
}

export class SessionHandlerImpl implements SessionHandler {
  private sessionId: string
  private socket: Socket

  private myStream?: MediaStream
  private onUserJoin?: UserJoinCallback
  private onUserLeave?: UserLeaveCallback

  private peers: Record<string, RTCPeerConnection> = {}

  constructor(socket: Socket, sessionid: string) {
    this.socket = socket
    this.sessionId = sessionid
  }

  start(myStream: MediaStream, onUserJoin: UserJoinCallback, onUserLeave: UserLeaveCallback): void {
    this.myStream = myStream
    this.onUserJoin = onUserJoin
    this.onUserLeave = onUserLeave
    this.setupProtocolListener()
    console.log('Joining session', this.sessionId)
    this.socket.emit('join-session', this.sessionId)
  }

  stop(): void {
    this.socket.disconnect()
    this.socket.close()
  }

  private setupProtocolListener() {
    this.socket.on('user-connected', (username: string) => {
      try {
        this.onUserConnected(username)
      } catch (e) {
        console.error(e)
      }
    })
    this.socket.on('user-disconnected', (username: string) => {
      try {
        this.onUserDisconnected(username)
      } catch (e) {
        console.error(e)
      }
    })
    this.socket.on('offer', (offer: RTCSessionDescriptionInit, from: string) => {
      try {
        this.onOffer(offer, from)
      } catch (e) {
        console.error(e)
      }
    })
    this.socket.on('answer', (answer: RTCSessionDescriptionInit, from: string) => {
      try {
        this.onAnswer(answer, from)
      } catch (e) {
        console.error(e)
      }
    })
    this.socket.on('ice-candidate', (candidate: RTCIceCandidate, from: string) => {
      try {
        this.onIceCandidate(candidate, from)
      } catch (e) {
        console.error(e)
      }
    })
  }

  private async onUserConnected(username: string) {
    console.log('[SessionHandler] User connected:', username)
    this.peers[username] = new RTCPeerConnection(WebRtcConfiguration)

    this.myStream!.getTracks().forEach((track) => {
      console.log('[SessionHandler] Adding track to:', username)
      this.peers[username].addTrack(track, this.myStream!)
    })

    this.peers[username].ontrack = (event) => {
      this.onUserJoin?.(username, event.streams[0])
    }

    const offer = await this.peers[username].createOffer()
    await this.peers[username].setLocalDescription(offer)

    console.log('[SessionHandler] Sending offer to:', username)
    this.socket.emit('offer', offer, username)

    this.peers[username].onicecandidate = (event) => {
      if (event.candidate) {
        console.log('[SessionHandler] Sending ice candidate to:', username)
        this.socket.emit('ice-candidate', event.candidate, username)
      }
    }
  }

  private async onUserDisconnected(username: string) {
    console.log('[SessionHandler] User disconnected:', username)
    this.onUserLeave?.(username)
    this.peers[username]?.close()
    delete this.peers[username]
  }

  private async onOffer(offer: RTCSessionDescriptionInit, from: string) {
    console.log('[SessionHandler] Received offer from:', from)
    this.peers[from] = new RTCPeerConnection(WebRtcConfiguration)
    this.peers[from].ontrack = (event) => {
      this.onUserJoin?.(from, event.streams[0])
    }
    this.peers[from].onicecandidate = (event) => {
      if (event.candidate) {
        console.log('[SessionHandler] Sending ice candidate to:', from)
        this.socket.emit('ice-candidate', event.candidate, from)
      }
    }
    this.myStream!.getTracks().forEach((track) => {
      this.peers[from].addTrack(track, this.myStream!)
    })
    await this.peers[from].setRemoteDescription(offer)
    const answer = await this.peers[from].createAnswer()
    await this.peers[from].setLocalDescription(answer)
    console.log('[SessionHandler] Sending answer to:', from)
    this.socket.emit('answer', answer, from)
  }

  private async onAnswer(answer: RTCSessionDescriptionInit, from: string) {
    console.log('[SessionHandler] Received answer from:', from)
    await this.peers[from].setRemoteDescription(answer)
  }

  private async onIceCandidate(candidate: RTCIceCandidate, from: string) {
    console.log('[SessionHandler] Received ice candidate from:', from)
    await this.peers[from].addIceCandidate(candidate)
  }
}
