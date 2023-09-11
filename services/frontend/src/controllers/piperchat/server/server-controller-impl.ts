import axios from 'axios'
import type { ServerController } from './server-controller'
export class ServerControllerImpl implements ServerController {
  async getServers(): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async getServer(id: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async createServer(name: string, description: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async updateServer(
    id: string,
    name?: string | undefined,
    description?: string | undefined
  ): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async deleteServer(id: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async getServerParticipants(id: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async joinServer(id: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async leaveServer(id: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async kickUserFromTheServer(id: string, admin: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
