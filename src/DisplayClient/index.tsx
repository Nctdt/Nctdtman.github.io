import { Button, Input } from 'antd'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'

import { useWs } from '@/context/Ws'
import { runInAction } from 'mobx'

export const DisplayClient: FC = observer(() => {
  const ws = useWs()
  const [username, setUsername] = useState('')
  const handleClick = () => {
    ws.send('rename', { username })
    runInAction(() => {
      ws.user.username = username
    })
  }
  return (
    <div>
      <div>当前用户名: {ws.user.username}</div>
      <Input onChange={e => setUsername(e.target.value)} value={username} />
      <Button onClick={handleClick}>rename Username</Button>
    </div>
  )
})

export default DisplayClient
