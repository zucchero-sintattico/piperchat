import { User } from '@models/user-model'
import { UserRepository } from '@repositories/user/user-repository'
import { UserRepositoryImpl } from '@repositories/user/user-repository-impl'
import {
  AuthController,
  AuthControllerExceptions,
} from '@controllers/auth/auth-controller'
import bcrypt from 'bcrypt'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@commons/utils/jwt'
import {
  UserCreatedMessage,
  UserLoggedInMessage,
  UserLoggedOutMessage,
} from '@messages-api/users'
import { BrokerController } from '@commons/utils/broker-controller'

export class AuthControllerImpl extends BrokerController implements AuthController {
  private userRepository: UserRepository = new UserRepositoryImpl()

  async register(
    username: string,
    email: string,
    password: string,
    description: string | null,
    photo: Buffer | null
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt())
    try {
      const user = await this.userRepository.createUser(
        username,
        email,
        hashedPassword,
        description,
        photo
      )
      await this.publish(
        UserCreatedMessage,
        new UserCreatedMessage({
          username: user.username,
          email: user.email,
          description: user.description,
          profilePicture: user.profilePicture,
        })
      )
      return user
    } catch (e: any) {
      if (e.code === 11000) {
        if (e.keyPattern.username) {
          throw new AuthControllerExceptions.UserAlreadyExists()
        }
        if (e.keyPattern.email) {
          throw new AuthControllerExceptions.EmailAlreadyExists()
        }
      }
      throw e
    }
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.getUserByUsername(username).catch(() => {
      throw new AuthControllerExceptions.InvalidUsernameOrPassword()
    })

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new AuthControllerExceptions.InvalidUsernameOrPassword()
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    await this.userRepository.login(user.username, refreshToken)

    await this.publish(
      UserLoggedInMessage,
      new UserLoggedInMessage({
        username: user.username,
      })
    )
    return accessToken
  }

  async refreshToken(username: string): Promise<string> {
    const user = await this.userRepository.getUserByUsername(username).catch(() => {
      throw new AuthControllerExceptions.UserNotFound()
    })

    if (!user.refreshToken) {
      throw new AuthControllerExceptions.RefreshTokenNotPresent()
    }

    try {
      verifyRefreshToken(user.refreshToken)
    } catch (e) {
      throw new AuthControllerExceptions.InvalidRefreshToken()
    }

    return generateAccessToken(user)
  }

  async logout(username: string): Promise<void> {
    await this.userRepository.logout(username).catch(() => {
      throw new AuthControllerExceptions.UserNotFound()
    })
    await this.publish(
      UserLoggedOutMessage,
      new UserLoggedOutMessage({
        username: username,
      })
    )
  }
}
