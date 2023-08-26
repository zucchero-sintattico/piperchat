import { EventLog, ServiceStatus } from '@models/monitoring-model'

export interface MonitoringRepository {
  /**
   * Log the event in the database.
   *
   * @param event The event to be logged.
   * @returns A promise that resolves when the event is logged.
   */
  log(event: any): Promise<void>

  /**
   * Get all events of a topic.
   *
   * @param topic The topic to get the events from.
   * @returns A promise that resolves to an array of events.
   * The array is empty if there are no events.
   * The array is sorted by timestamp in ascending order.
   * The array is limited to 1000 events.
   */
  getLogsOfTopic(topic: string): Promise<EventLog[]>

  /**
   * Get all events of a topic and event.
   *
   * @param topic The topic to get the events from.
   * @param event The event to get the events from.
   * @returns A promise that resolves to an array of events.
   * The array is empty if there are no events.
   * The array is sorted by timestamp in ascending order.
   * The array is limited to 1000 events.
   */
  getLogsOfTopicAndEvent(topic: string, event: string): Promise<EventLog[]>

  /**
   * Create a new service status.
   *
   * @param service The service to create the status of.
   * @param status The status of the service.
   * @returns A promise that resolves when the status is created.
   *
   */
  createServiceStatus(service: string, status: string): Promise<void>

  /**
   * Change the status of a service.
   *
   * @param service The service to change the status of.
   * @param status The new status of the service.
   * @returns A promise that resolves when the status is changed.
   */
  changeServiceStatus(service: string, status: string): Promise<void>

  /**
   * Get the status of a service.
   *
   * @param service The service to get the status of.
   * @returns A promise that resolves to an array of statuses.
   *
   * The array is empty if there are no statuses.
   */
  getServiceStatus(service: string): Promise<ServiceStatus>

  /**
   * Get the status of all services.
   *
   * @returns A promise that resolves to an array of statuses.
   *
   * The array is empty if there are no statuses.
   */
  getServicesStatus(): Promise<ServiceStatus[]>
}
