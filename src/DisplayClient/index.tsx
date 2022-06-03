import { Button, Input } from 'antd'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef, useState } from 'react'

import { useWs } from '@/context/Ws'
import { autorun, runInAction } from 'mobx'

export const DisplayClient: FC = observer(() => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const ws = useWs()
  const video = videoRef.current
  if (ws.remoteStream && video && !video.srcObject) {
    video.srcObject = ws.remoteStream
  }
  return (
    <div>
      <video ref={videoRef} autoPlay></video>
    </div>
  )
})

export default DisplayClient
