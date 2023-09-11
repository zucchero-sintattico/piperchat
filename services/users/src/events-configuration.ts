import { EventsConfiguration } from '@commons/events/events-configuration'
import { UserCreatedMessage, UserDeletedMessage } from '@messages-api/users'

export class UserServiceEventsConfiguration extends EventsConfiguration {
  constructor() {
    super()
  }
}
