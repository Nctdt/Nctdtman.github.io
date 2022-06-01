let memo: {
  localConnection: RTCPeerConnection
  remoteConnection: RTCPeerConnection
  sendChannel: RTCDataChannel
  receiveChannel: unknown
} | null = null

type PeerEvent = {
  [K in keyof RTCPeerConnectionEventMap]?: (
    ev: RTCPeerConnectionEventMap[K],
  ) => void
}
type Option = {
  localEvent?: PeerEvent
  remoteEvent?: PeerEvent
}
async function connectPeers(
  stream: MediaStream,
  { localEvent = {}, remoteEvent = {} }: Option = {},
) {
  if (memo) return memo

  const mountPeerEvent = (peer: RTCPeerConnection, evMap: PeerEvent) => {
    for (const [k, v] of Object.entries(evMap) as any) {
      peer.addEventListener(k, v)
    }
  }

  const localConnection = new RTCPeerConnection()
  mountPeerEvent(localConnection, localEvent)
  const sendChannel = localConnection.createDataChannel('sendChannel')
  stream
    .getTracks()
    .forEach(t => localConnection.addTransceiver(t, { streams: [stream] }))
  console.log('创建本地连接节点和管道成功')

  const remoteConnection = new RTCPeerConnection()
  mountPeerEvent(remoteConnection, remoteEvent)
  const p = new Promise<RTCDataChannel>(rs => {
    remoteConnection.ondatachannel = e => rs(e.channel)
  })
  console.log('创建远程连接节点')

  const handleIceCandidate =
    (peer: RTCPeerConnection) => (e: RTCPeerConnectionIceEvent) =>
      e.candidate && peer.addIceCandidate(e.candidate)

  localConnection.onicecandidate = handleIceCandidate(remoteConnection)
  remoteConnection.onicecandidate = handleIceCandidate(localConnection)
  const localOffer = await localConnection.createOffer()
  await Promise.all([
    localConnection.setLocalDescription(localOffer),
    remoteConnection.setRemoteDescription(localOffer),
  ])
  const remoteAnswer = await remoteConnection.createAnswer()
  await Promise.all([
    remoteConnection.setLocalDescription(remoteAnswer),
    localConnection.setRemoteDescription(remoteAnswer),
  ])
  console.log('ice 连接成功')
  const receiveChannel = await p
  memo = {
    localConnection,
    remoteConnection,
    sendChannel,
    receiveChannel,
  }
  return memo
}

export { connectPeers }
