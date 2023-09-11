interface ExchangeConfiguration {
  events: { [key: string]: (data: unknown) => void }
}

export class EventsConfiguration {
  exchanges: { [key: string]: ExchangeConfiguration } = {}
  async on<T>(
    EventType: { exchange: string; routingKey: string },
    callback: (message: T) => void
  ) {
    if (!this.exchanges[EventType.exchange]) {
      this.exchanges[EventType.exchange] = {
        events: {},
      }
    }
    this.exchanges[EventType.exchange].events[EventType.routingKey] = (data: unknown) => {
      callback(data as T)
    }
  }
}
