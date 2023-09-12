import { Microservice } from '@commons/service'
import { NotificationsServiceConfiguration } from './configuration'

const service = new Microservice(NotificationsServiceConfiguration)
service.start()
