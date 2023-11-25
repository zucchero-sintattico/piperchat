import { Microservice } from '@commons/service'
import { MultimediaServiceConfiguration } from './configuration'

const service = new Microservice(MultimediaServiceConfiguration)
service.start()
