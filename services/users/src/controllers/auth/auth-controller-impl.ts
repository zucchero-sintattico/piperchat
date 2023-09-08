import { User } from '@models/user-model'
import { UserRepository } from '@repositories/user/user-repository'
import { UserRepositoryImpl } from '@repositories/user/user-repository-impl'
import {
  AuthController,
  AuthControllerExceptions,
} from '@controllers/auth/auth-controller'
import bcrypt from 'bcrypt'
import {
  RabbitMQ,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@piperchat/commons'
import { UserCreatedMessage, UserLoggedInMessage } from '@messages-api/users'

export class AuthControllerImpl implements AuthController {
  private broker: RabbitMQ = RabbitMQ.getInstance()
  private userRepository: UserRepository = new UserRepositoryImpl()

  async register(
    username: string,
    email: string,
    password: string,
    description: string | null,
    photo: Buffer | null
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt())
    const user = await this.userRepository
      .createUser(username, email, hashedPassword, description, photo)
      .catch(() => {
        throw new AuthControllerExceptions.UserAlreadyExists()
      })
    await this.broker.publish(
      new UserCreatedMessage({
        username: user.username,
        email: user.email,
        description: user.description,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      })
    )
    return user
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

    await this.broker.publish(
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
    await this.broker.publish(
      new UserLoggedInMessage({
        username: username,
      })
    )
  }
}
