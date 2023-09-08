import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'

export const connect = (serverId, channelId, stream, token, onStream, onUserLeave) => {
  const constraints = {
    video: true,
    audio: false,
  }
  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
    auth: {
      token: token,
    },
  })

  socket.on('connect', () => {
    console.log('connected to the service')

    const peers = {}

    socket.on('user-connected', async (userId) => {
      console.log('Received user-connected from', userId)
      console.log('Creating RTCPeerConnection')
      peers[userId] = new RTCPeerConnection({
        iceServers: [
          {
            urls: 'stun:localhost:3478',
          },
        ],
        turnServers: [
          {
            urls: 'turn:localhost:5349',
            username: 'coturn',
            credential: 'coturn-password',
          },
        ],
      })
      peers[userId].ontrack = (event) => {
        console.log('ontrack', event)
        onStream(userId, event.streams[0])
      }
      peers[userId].onicecandidate = (event) => {
        console.log('onicecandidate', event)
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate, userId)
        }
      }
      peers[userId].onconnectionstatechange = (event) => {
        console.log('Connection state change', event, 'for', userId)
      }
      console.log('Creating offer')

      stream.getTracks().forEach((track) => {
        peers[userId].addTrack(track, stream)
      })

      const offer = await peers[userId].createOffer()
      await peers[userId].setLocalDescription(offer)
      socket.emit('offer', offer, userId)
    })
    socket.on('user-disconnected', (userId) => {
      console.log('user-disconnected', userId)
      peers[userId].close()
      delete peers[userId]
      onUserLeave(userId)
    })
    socket.on('offer', async (offer, from) => {
      console.log('Received offer', offer + ' from ' + from)
      peers[from] = new RTCPeerConnection({
        iceServers: [
          {
            urls: 'stun:localhost:3478',
          },
        ],
        turnServers: [
          {
            urls: 'turn:localhost:5349',
            username: 'coturn',
            credential: 'coturn-password',
          },
        ],
      })

      peers[from].ontrack = (event) => {
        console.log('ontrack', event)
        onStream(from, event.streams[0])
      }
      peers[from].setRemoteDescription(offer)
      peers[from].onicecandidate = (event) => {
        console.log('onicecandidate', event)
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate, from)
        }
      }
      peers[from].onconnectionstatechange = (event) => {
        console.log('Connection state change', event, 'for', from)
      }

      stream.getTracks().forEach((track) => {
        peers[from].addTrack(track, stream)
      })

      console.log('Creating answer')
      const answer = await peers[from].createAnswer()
      await peers[from].setLocalDescription(answer)
      console.log('Sending answer')
      socket.emit('answer', answer, from)
    })
    socket.on('answer', async (answer, from) => {
      console.log('Received answer', answer + ' from ' + from)
      await peers[from].setRemoteDescription(answer)
    })
    socket.on('ice-candidate', async (candidate, from) => {
      console.log('Received ice-candidate', candidate + ' from ' + from)
      await peers[from].addIceCandidate(candidate)
    })
    console.log('Joining channel', channelId, 'on server', serverId)

    socket.emit('join-channel', serverId, channelId)
  })

  socket.on('disconnect', () => {
    console.log('disconnected')
  })

  socket.connect()
}
