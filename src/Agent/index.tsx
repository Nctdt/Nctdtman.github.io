import { useWs } from '@/context/Ws'
import { List } from 'antd'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'

export const Agent: FC = observer(() => {
  const ws = useWs()
  useEffect(() => {
    ws.send('changeType', { type: 'agent' })
  }, [])
  return (
    <div>
      <List
        dataSource={ws.users}
        renderItem={user => (
          <List.Item>
            用户: {user.username}, id: {user.id}
          </List.Item>
        )}
      />
    </div>
  )
})
export default Agent
