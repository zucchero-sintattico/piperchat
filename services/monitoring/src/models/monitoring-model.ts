import { Schema, model } from 'mongoose'

interface EventLog {
  _id: string
  topic: string
  event: string
  payload: object
  timestamp: Date
}

interface ServiceStatus {
  _id: string
  service: string
  status: string
  timestamp: Date
}

const EventLogSchema = new Schema<EventLog>({
  topic: String,
  event: String,
  payload: Object,
  timestamp: { type: Date, default: Date.now },
})

const ServiceStatusSchema = new Schema<ServiceStatus>({
  service: { type: String, unique: true },
  status: String,
  timestamp: { type: Date, default: Date.now },
})

const EventLogEntity = model<EventLog>('MonitoringEntity', EventLogSchema)
const ServiceStatusEntity = model<ServiceStatus>(
  'ServiceStatusEntity',
  ServiceStatusSchema
)

export { EventLog, EventLogEntity, ServiceStatus, ServiceStatusEntity }
