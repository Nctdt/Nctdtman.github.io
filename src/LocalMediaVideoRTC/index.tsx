import { useRef, useState } from 'react'
import { connectPeers, disconnectPeers } from '@/utils/peers'
import { Button } from 'antd'

const LocalMediaVideoRTC = () => {
  const [disabled, setDisabled] = useState({
    start: false,
    remote: false,
    hangUp: true,
    stop: true,
  })
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const startUp = async () => {
    const video = localVideoRef.current
    if (!video) return
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })
    console.log('stream', stream)
    streamRef.current = stream
    video.srcObject = stream
    video.play()
    setDisabled(d => ({
      ...d,
      start: true,
      stop: false,
    }))
  }
  const stop = () => {
    const localVideo = localVideoRef.current
    const stream = streamRef.current
    if (localVideo && stream) {
      stream.getTracks().forEach(t => t.stop())
      localVideo.pause()
      localVideo.srcObject = null
      setDisabled(d => ({
        ...d,
        start: false,
        stop: true,
      }))
    }
  }
  const connectRemote = async () => {
    console.log('开始连接远程')
    const remoteVideo = remoteVideoRef.current
    const stream = streamRef.current
    if (stream && remoteVideo) {
      await connectPeers(stream, {
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
        hangUp: false,
      }))
    }
  }
  const hangUp = () => {
    disconnectPeers()
    setDisabled(d => ({
      ...d,
      remote: false,
      hangUp: true,
    }))
  }
  return (
    <div className="App">
      <video ref={localVideoRef}></video>
      <video ref={remoteVideoRef} autoPlay></video>
      <Button onClick={startUp} disabled={disabled['start']}>
        start up
      </Button>
      <Button onClick={connectRemote} disabled={disabled['remote']}>
        remote
      </Button>
      <Button onClick={hangUp} disabled={disabled['hangUp']}>
        hang up
      </Button>
      <Button onClick={stop} disabled={disabled['stop']}>
        stop
      </Button>
    </div>
  )
}

export default LocalMediaVideoRTC
