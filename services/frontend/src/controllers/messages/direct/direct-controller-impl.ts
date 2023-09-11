import axios from 'axios'
import type { DirectController } from './direct-controller'
export class DirectControllerImpl implements DirectController {
  async getDirectMessagesPaginated(username: string, from: number, limit: number): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async sendDirectMessage(username: string, message: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
