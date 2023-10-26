import axios from 'axios'
import { MonitoringRepository } from './repositories/monitoring-repository'
import { MonitoringRepositoryImpl } from './repositories/monitoring-repository-impl'
import http from 'http'

export class HealthCheckService {
  private monitoringRepository: MonitoringRepository = new MonitoringRepositoryImpl()
  private intervalController: NodeJS.Timeout | undefined
  private microservices: string[] = process.env.SERVICES_URI
    ? process.env.SERVICES_URI.split(',')
    : []
  private interval: number = Number.parseInt(process.env.HEALTHCHECK_INTERVAL!) || 2000

  async start() {
    await this.monitoringRepository.cleanServiceStatus()
    for (const microservice of this.microservices) {
      await this.monitoringRepository.createServiceStatus(microservice, 'offline')
      console.log(`Created status for ${microservice}`)
    }
    this.intervalController = setInterval(async () => {
      this.microservices.forEach(async (microservice) => {
        try {
          const path = microservice + '/health'
          console.log(`Checking ${path}`)
          await axios.get(path, {
            httpAgent: new http.Agent({ keepAlive: false }),
          })
          await this.monitoringRepository.changeServiceStatus(microservice, 'online')
          console.log(`${microservice} is online`)
        } catch (error) {
          console.log(error)
          await this.monitoringRepository.changeServiceStatus(microservice, 'offline')
          console.log(`${microservice} is offline`)
        }
      })
    }, this.interval)
  }

  async stop() {
    if (this.intervalController) {
      clearInterval(this.intervalController)
    }
  }
}
