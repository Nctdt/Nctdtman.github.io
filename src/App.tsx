import { Button, Divider, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { Link, Route, Routes } from 'react-router-dom'
import Agent from './Agent'
import DisplayClient from './DisplayClient'
import LocalMediaVideoRTC from './LocalMediaVideoRTC'
import LocalVideoRTC from './LocalVideoRTC'
import MediaTakePicture from './MediaTakePicture'
import { disconnectPeer } from './rtc/peers'

const routers = {
  'media-take-picture': MediaTakePicture,
  'local-video-rtc': LocalVideoRTC,
  'local-media-video-rtc': LocalMediaVideoRTC,
  'display-client': DisplayClient,
  agent: Agent,
}
const links = Object.keys(routers)
const routersEntires = Object.entries(routers)

const App = () => {
  return (
    <div>
      <nav>
        <Space wrap>
          {links.map((link, i) => (
            <Link key={link} to={link} onClick={disconnectPeer}>
              <Button>
                step-{i + 1} {link}
              </Button>
            </Link>
          ))}
        </Space>
      </nav>
      <Divider />
      <Routes>
        {routersEntires.map(([path, Component]) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </div>
  )
}

export default App
