import { EventLog, ServiceStatus } from '@models/monitoring-model'

export interface MonitoringController {
  /**
   * Get all logs of a topic
   *
   * @param topic
   * @returns array of logs
   */
  getLogsOfTopic(topic: string): Promise<EventLog[]>

  /**
   * Get all logs of a topic and event
   *
   * @param topic
   * @param event
   * @returns array of logs
   */
  getLogsOfTopicAndEvent(topic: string, event: string): Promise<EventLog[]>

  /**
   * Get all service status
   *
   * @returns array of service status
   *
   */
  getServiceStatus(): Promise<ServiceStatus[]>

  /**
   * Get service status by service name
   *
   * @param serviceName
   */
  getServiceStatusByServiceName(serviceName: string): Promise<ServiceStatus>
}

export class MonitoringControllerExceptions {
  static UserNotAuthorized = class extends Error {}
}
