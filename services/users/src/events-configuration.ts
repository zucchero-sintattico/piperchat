import { EventsConfiguration } from '@piperchat/commons/src/events/events-configuration'
import { UserCreatedMessage, UserDeletedMessage } from '@piperchat/messages-api/src/users'

export class UserServiceEventsConfiguration extends EventsConfiguration {
  constructor() {
    super()
  }
}
