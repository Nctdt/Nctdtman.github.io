import { createContext, FC, PropsWithChildren, useContext } from 'react'
import { WsManager } from '@/utils/ws'

const wsManager = new WsManager()
const context = createContext<WsManager | null>(null)

const useWs = () => useContext(context)!

const WsProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  return <context.Provider value={wsManager}>{children}</context.Provider>
}

export { WsProvider, useWs }
