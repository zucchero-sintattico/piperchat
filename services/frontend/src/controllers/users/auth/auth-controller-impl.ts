import type { AuthController } from './auth-controller'
import { RegisterApi, LoginApi, LogoutApi, RefreshTokenApi } from '@piperchat/api/src/users/auth'
import { AxiosController } from '../axios-controller'

export class AuthControllerImpl extends AxiosController implements AuthController {
  async register(request: RegisterApi.Request.Type): Promise<RegisterApi.Response> {
    const body = request as RegisterApi.Request.Body
    return await this.post<RegisterApi.Response>('/auth/register', body)
  }

  async login(request: LoginApi.Request.Type): Promise<LoginApi.Response> {
    const body = request as LoginApi.Request.Body
    return await this.post<LoginApi.Response>('/auth/login', body)
  }

  async logout(): Promise<LogoutApi.Response> {
    return await this.post<LogoutApi.Response>('/auth/logout', {})
  }

  async refreshToken(): Promise<RefreshTokenApi.Response> {
    return await this.post<RefreshTokenApi.Response>('/auth/refresh-token', {})
  }
}
