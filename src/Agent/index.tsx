import { useWs } from '@/context/Ws'
import { Button, List } from 'antd'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef } from 'react'

export const Agent: FC = observer(() => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const ws = useWs()
  useEffect(() => {
    ws.send('changeType', { type: 'agent' })
  }, [])

  const handleClick = (targetId: string) => {
    runInAction(() => {
      ws.stream = (videoRef.current as any).captureStream() as MediaStream
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
            <Button onClick={() => handleClick(user.id)}>传输视频</Button>
          </List.Item>
        )}
      />
      <video ref={videoRef} controls muted>
        <source src="/media/test.mp4" />
      </video>
    </div>
  )
})
export default Agent
