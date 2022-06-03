import http from 'http'
import ws, { server } from 'websocket'
import { v4 as uuid } from 'uuid'

type Connection = {
  connect: ws.connection
  user: UserInfo
}
let connections: Connection[] = []
const send = <T extends WsTypes>(
  connect: ws.connection,
  type: T,
  id: string,
  data: WsDataMap[T]['data'],
) => {
  connect.sendUTF(JSON.stringify({ type, id, data }))
}
const findConnectionById = (id: string) => {
  return connections.find(c => c.user.id === id)
}

const httpServer = http
  .createServer((req, res) => {
    console.log(new Date() + ' Received request for ' + req.url)
    res.writeHead(404)
    res.end()
  })
  .listen(6502, () => {
    console.log(new Date() + ' Server is listening on port 6502')
  })
const wsServer = new server({
  httpServer,
  autoAcceptConnections: false,
})

wsServer.on('request', req => {
  console.log(connections.map(({ user }) => user))
  const id = uuid()
  const user: UserInfo = { id, username: '', type: 'user' }
  const connect = req.accept('json', req.origin)
  const connection = { connect, user }

  const allSendUserList = () => {
    for (const connection of connections) {
      const { connect, user } = connection
      if (user.type === 'agent') {
        send(connect, 'userList', user.id, {
          users: connections
            .map(({ user }) => user)
            .filter(u => u.type === 'user'),
        })
      }
    }
  }

  connections.push(connection)
  console.log('connection accepted')
  send(connect, 'userInfo', id, user)
  allSendUserList()
  connect.on('message', message => {
    if (message.type === 'utf8') {
      const { type, id, data } = JSON.parse(message.utf8Data) as WsData
      console.log('received', type, id, data)
      switch (type) {
        case 'rename': {
          user.username = data.username
          allSendUserList()
          break
        }
        case 'changeType': {
          user.type = data.type
          allSendUserList()
          break
        }
        case 'closePeer':
        case 'invite':
        case 'accessInvite':
        case 'videoOffer':
        case 'videoAnswer':
        case 'newIceCandidate': {
          const { targetId } = data
          const targetConnection = findConnectionById(targetId)
          if (targetConnection) {
            const { connect } = targetConnection
            send(connect, type, id, data)
          }
          break
        }
      }
    }
  })
  connect.on('close', () => {
    connections = connections.filter(c => c.connect.connected)
    allSendUserList()
  })
})
