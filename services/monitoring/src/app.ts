import { Microservice } from '@commons/service'
import { MonitoringServiceConfiguration } from './configuration'

const service = new Microservice(MonitoringServiceConfiguration)
service.start()
