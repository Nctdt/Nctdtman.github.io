import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import VConsole from 'vconsole'
import 'antd/dist/antd.css'
import 'webrtc-adapter'

import './main.css'
import App from './App'
import { WsProvider } from './context/Ws'

new VConsole()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <WsProvider>
        <App />
      </WsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
