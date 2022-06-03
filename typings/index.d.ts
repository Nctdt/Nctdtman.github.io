type Data<T extends string, D> = {
  type: T
  id: string
  data: D
}
type UserType = 'agent' | 'user'
type UserInfo = {
  username: string
  id: string
  type: UserType
}

type WsDataMap = {
  userInfo: Data<'id', UserInfo>
  userList: Data<
    'userList',
    {
      users: UserInfo[]
    }
  >
  rename: Data<
    'rename',
    {
      username: string
    }
  >
  changeType: Data<
    'changeType',
    {
      type: UserType
    }
  >
}

type WsTypes = keyof WsDataMap
type WsData = WsDataMap[WsTypes]
