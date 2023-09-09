import { EventsConfiguration } from '@piperchat/commons/src/events/events-configuration'
import { UserCreatedMessage, UserDeletedMessage } from '@piperchat/messages-api/src/users'

export class PiperchatServiceEventsConfiguration extends EventsConfiguration {
  constructor() {
    super()
    this.on(UserCreatedMessage, (message: UserCreatedMessage) => {
      console.log('User created', message)
    })
    this.on(UserDeletedMessage, (message: UserDeletedMessage) => {
      console.log('User deleted', message)
    })
  }
}
