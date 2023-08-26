import axios from 'axios'
import { MonitoringRepository } from './repositories/monitoring-repository'
import { MonitoringRepositoryImpl } from './repositories/monitoring-repository-impl'

export class HealthCheckService {
  private monitoringRepository: MonitoringRepository = new MonitoringRepositoryImpl()
  private microservices: string[] = process.env.SERVICES_URI!.split(',')

  async start() {
    setInterval(() => {
      this.microservices.forEach(async (microservice) => {
        try {
          await axios.get(microservice)
          await this.monitoringRepository.changeServiceStatus(microservice, 'online')
        } catch (error) {
          await this.monitoringRepository.changeServiceStatus(microservice, 'offline')
        }
      })
    }, 5000)
  }
}
