import { EventsConfiguration } from '@commons/events/events-configuration'
import { UserCreatedMessage, UserDeletedMessage } from '@messages-api/users'

export class PiperchatServiceEventsConfiguration extends EventsConfiguration {
  constructor() {
    super()
  }
}
