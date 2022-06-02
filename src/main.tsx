import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import VConsole from 'vconsole'
import 'antd/dist/antd.css'
import 'webrtc-adapter'

import './main.css'
import App from './App'

new VConsole()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
