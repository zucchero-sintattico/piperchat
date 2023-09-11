import { BadRequest, InternalServerError } from '@piperchat/api/src/errors'
import axios from 'axios'

export abstract class AxiosController {
  protected async request<Response>(method: string, path: string, data: object): Promise<Response> {
    try {
      const response = await axios.request<Response>({
        method: method,
        url: path,
        data: data
      })
      return response.data
    } catch (e: any) {
      if (e.response.data instanceof BadRequest) {
        const errorResponse = e.response.data as BadRequest
        throw new Error(errorResponse.toString())
      } else if (e.response.data instanceof InternalServerError) {
        const errorResponse = e.response.data as InternalServerError
        throw new Error(errorResponse.toString())
      } else {
        return e.response.data as Response
      }
    }
  }

  protected async post<Success>(path: string, data: object): Promise<Success> {
    return await this.request<Success>('post', path, data)
  }

  protected async get<Success>(path: string, data: object): Promise<Success> {
    return await this.request<Success>('get', path, data)
  }

  protected async put<Success>(path: string, data: object): Promise<Success> {
    return await this.request<Success>('put', path, data)
  }

  protected async delete<Success>(path: string, data: object): Promise<Success> {
    return await this.request<Success>('delete', path, data)
  }
}
