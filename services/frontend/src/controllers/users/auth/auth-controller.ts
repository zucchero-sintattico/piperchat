import { RefreshTokenApi, RegisterApi, LoginApi, LogoutApi } from '@api/users/auth'

export interface AuthController {
  /**
   * Register a new user.
   * @param request The request.
   */
  register(request: RegisterApi.Request.Type): Promise<RegisterApi.Response>

  /**
   * Login a user.
   * @param request The request.
   */
  login(request: LoginApi.Request.Type): Promise<LoginApi.Response>

  /**
   * Logout a user.
   */
  logout(): Promise<LogoutApi.Response>

  /**
   * Refresh the access token of a user.
   */
  refreshToken(): Promise<RefreshTokenApi.Response>
}
