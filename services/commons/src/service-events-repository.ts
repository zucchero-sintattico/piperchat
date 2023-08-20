import { BasicEventsRepository } from './basic-events-repository'

export class ServiceEventsRepository extends BasicEventsRepository {
  async publishServiceStatusOnline(serviceName: string): Promise<void> {
    const channel = this.getChannel()
    if (channel) {
      channel.publish(
        'services',
        'new.service.status',
        Buffer.from(
          JSON.stringify({
            service: serviceName,
            status: 'online',
          })
        )
      )
    }
  }

  async publishServiceStatusOffline(serviceName: string): Promise<void> {
    const channel = this.getChannel()
    if (channel) {
      channel.publish(
        'services',
        'new.service.status',
        Buffer.from(
          JSON.stringify({
            service: serviceName,
            status: 'offline',
          })
        )
      )
    }
  }
}
