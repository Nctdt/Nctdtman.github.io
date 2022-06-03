import { autorun, makeAutoObservable } from 'mobx'

const wsUrl = `ws://${document.location.hostname}:6502`
class WsManager {
  user = {} as UserInfo
  users: UserInfo[] = []
  connection = new WebSocket(wsUrl, 'json')
  opened = false
  queue: (() => void)[] = []
  addQueue(fc: () => void) {
    if (this.connection.readyState === 0) {
      this.queue.push(fc)
    } else if (this.connection.readyState === 1) {
      fc()
    }
  }
  send<T extends WsTypes>(type: T, data: WsDataMap[T]['data']) {
    this.addQueue(() =>
      this.connection.send(JSON.stringify({ type, data, id: this.user.id })),
    )
  }
  constructor() {
    makeAutoObservable(this)
    this.connection.onopen = () => {
      while (this.queue.length) this.queue.shift()!()
    }
    this.connection.onmessage = ev => {
      const { type, data, id } = JSON.parse(ev.data) as WsData
      console.log(id, type, data)
      switch (type) {
        case 'id': {
          this.user.id = id
          break
        }
        case 'userList': {
          this.users = data.users
          break
        }
      }
    }
  }
}

export { WsManager }
