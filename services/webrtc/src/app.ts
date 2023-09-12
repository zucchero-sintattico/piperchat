import { Microservice } from '@commons/service'
import { WebRtcServiceConfiguration } from './configuration'

const service = new Microservice(WebRtcServiceConfiguration)
service.start()
