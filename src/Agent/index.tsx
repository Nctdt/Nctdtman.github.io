import { useWs } from '@/context/Ws'
import { Button, List } from 'antd'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef } from 'react'

export const Agent: FC = observer(() => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const ws = useWs()
  if (ws.remoteStream && videoRef.current) {
    console.log('ws.remoteStream: ', ws.remoteStream)
    videoRef.current.srcObject = ws.remoteStream
    videoRef.current.play()
  }
  useEffect(() => {
    ws.send('changeType', { type: 'agent' })
  }, [])

  const handleClick = async (targetId: string) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    console.log('local stream: ', stream)
    runInAction(() => {
      ws.stream = stream
      ws.targetId = targetId
    })
    ws.send('invite', { targetId, fromName: '经纪人 name ' })
  }
  return (
    <div>
      <List
        dataSource={ws.users}
        renderItem={user => (
          <List.Item>
            用户: {user.username}, id: {user.id}
            <Button onClick={() => handleClick(user.id)}>发起语音通话</Button>
          </List.Item>
        )}
      />
      <video ref={videoRef} controls muted></video>
    </div>
  )
})
export default Agent
