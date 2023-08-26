import axios from 'axios'
import { MonitoringRepository } from './repositories/monitoring-repository'
import { MonitoringRepositoryImpl } from './repositories/monitoring-repository-impl'

export class HealthCheckService {
  private monitoringRepository: MonitoringRepository = new MonitoringRepositoryImpl()
  private microservices: string[] = [
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
  ]

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
