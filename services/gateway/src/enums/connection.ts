export enum EMessageTypes {
  Error = 'error',
  Credentials = 'credentials',
  Send = 'send',
  Heartbeat = 'heartbeat',
}

export enum ERabbit {
  RetryLimit = 10,
}

export enum EServices {
  Gateway = 'gateway',
  Users = 'users',
}

export enum EAmqQueues {
  Gateway = 'gatewayQueue',
  Users = 'usersQueue',
}
