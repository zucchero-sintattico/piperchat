import { EventsConfiguration } from '@commons/events/events-configuration'
import { UserCreatedMessage, UserDeletedMessage } from '@messages-api/users'

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
