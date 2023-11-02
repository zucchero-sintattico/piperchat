import { Microservice } from '@commons/service'
import { PiperchatServiceConfiguration } from './configuration'

const service = new Microservice(PiperchatServiceConfiguration)
service.start()
