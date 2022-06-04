import { Button, Input } from 'antd'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef, useState } from 'react'

import { useWs } from '@/context/Ws'
import { autorun, runInAction } from 'mobx'

export const DisplayClient: FC = observer(() => {
  return <div></div>
})

export default DisplayClient
