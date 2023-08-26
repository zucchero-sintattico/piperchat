import axios from 'axios'
import { MonitoringRepository } from './repositories/monitoring-repository'
import { MonitoringRepositoryImpl } from './repositories/monitoring-repository-impl'

export class HealthCheckService {
  private monitoringRepository: MonitoringRepository = new MonitoringRepositoryImpl()
  private microservices: string[] = process.env.SERVICES_URI
    ? process.env.SERVICES_URI.split(',')
    : []
  private interval: number = Number.parseInt(process.env.HEALTHCHECK_INTERVAL!) || 5000

  async start() {
    setInterval(() => {
      this.microservices.forEach(async (microservice) => {
        try {
          console.log(`Checking ${microservice}`)
          await axios.get(microservice)
          await this.monitoringRepository.changeServiceStatus(microservice, 'online')
        } catch (error) {
          await this.monitoringRepository.changeServiceStatus(microservice, 'offline')
        }
      })
    }, this.interval)
  }
}
