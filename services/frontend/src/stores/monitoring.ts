import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MonitoringController } from '@/controllers/monitoring/monitoring-controller'
import { MonitoringControllerImpl } from '@/controllers/monitoring/monitoring-controller'
import { GetServicesStatusApi } from '@api/monitoring/status'

export const useMonitoringStore = defineStore('monitoring', () => {
  const monitoringController: MonitoringController = new MonitoringControllerImpl()
  const serviceStatus = ref()

  async function refreshServicesStatus() {
    const response =
      (await monitoringController.getServicesStatus()) as GetServicesStatusApi.Responses.Success
    if (response.statusCode === 200) {
      const typed = response as GetServicesStatusApi.Responses.Success
      serviceStatus.value = typed.services
    }
  }

  return {
    serviceStatus,
    refreshServicesStatus
  }
})
