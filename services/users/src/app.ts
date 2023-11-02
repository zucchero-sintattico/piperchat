import { Microservice } from '@commons/service'
import { UserServiceConfiguration } from './configuration'

const userService = new Microservice(UserServiceConfiguration)
userService.start()
