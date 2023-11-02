import { Microservice } from '@commons/service'
import { MessagesServiceConfiguration } from './configuration'

const service = new Microservice(MessagesServiceConfiguration)
service.start()
