import { useState, useRef } from 'react'
import { connectPeers, disconnectPeers } from '@/peers'
import { Button } from 'antd'

const LocalVideoRTC = () => {
  const [disabled, setDisabled] = useState({
    start: false,
    remote: false,
    stop: true,
  })
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const stop = () => {
    disconnectPeers()
    setDisabled(d => ({
      ...d,
      start: false,
      stop: true,
    }))
  }
  const connectRemote = async () => {
    console.log('开始连接远程')
    const localVideo = localVideoRef.current
    const remoteVideo = remoteVideoRef.current
    if (localVideo && remoteVideo) {
      await connectPeers((localVideo as any).captureStream() as MediaStream, {
        remoteEvent: {
          track(ev) {
            console.log('streams: ', ev.streams)
            remoteVideo.srcObject = ev.streams[0]
          },
        },
      })
      console.log('创建连接成功')
      setDisabled(d => ({
        ...d,
        remote: true,
        stop: false,
      }))
    }
  }
  return (
    <div className="App">
      <video ref={localVideoRef} height="400" controls muted>
        <source src="/meida/test.mp4" />
      </video>
      <video ref={remoteVideoRef} height="400" autoPlay></video>
      <Button onClick={connectRemote} disabled={disabled['remote']}>
        remote
      </Button>
      <Button onClick={stop} disabled={disabled['stop']}>
        stop
      </Button>
    </div>
  )
}
export default LocalVideoRTC
