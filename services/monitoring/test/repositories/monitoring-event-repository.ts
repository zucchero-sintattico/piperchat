import { BasicEventRepository } from './basic-event-repository'

/**
 * Monitoring event repository
 *
 * It is responsible for publishing events to the message broker.
 * It is created for testing purposes.
 */
export class MonitoringEventRepository extends BasicEventRepository {
  async publishMessageEvent(topic: string, event: string, data: any) {
    const channel = this.getChannel()
    if (channel) {
      channel.publish(topic, event, Buffer.from(JSON.stringify(data)))
    }
  }

  async publishNewServiceStatus(service: string, status: string) {
    await this.publishMessageEvent('services', 'new.service.status', {
      service: service,
      status: status,
    })
  }
}
