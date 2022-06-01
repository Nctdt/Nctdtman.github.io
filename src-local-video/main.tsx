import React from 'react'
import ReactDOM from 'react-dom/client'
import VConsole from 'vconsole';
import 'webrtc-adapter'

import App from './App'

new VConsole();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
