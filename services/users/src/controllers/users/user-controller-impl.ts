import { UserEventsRepository } from "../../events/repositories/user-events-repository";
import { User, Users } from "../../models/user-model";
import { UserRepositoryImpl } from "../../repositories/user-repository";
import { UserController, UserControllerExceptions } from "./user-controller";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
	generateAccessToken,
	verifyAccessToken,
	verifyRefreshToken,
} from "../../utils/jwt";

export class UserControllerImpl implements UserController {
	private userRepository: UserRepositoryImpl = new UserRepositoryImpl();
	private userEventsRepository: UserEventsRepository =
		new UserEventsRepository();

	async register(
		username: string,
		email: string,
		password: string
	): Promise<User> {
		const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
		const user = await this.userRepository
			.createUser(username, email, hashedPassword)
			.catch(() => {
				throw new UserControllerExceptions.UserAlreadyExists();
			});
		await this.userEventsRepository.publishUserCreated(user);
		return user;
	}

	async login(username: string, password: string): Promise<string> {
		const user = await this.userRepository
			.getUserByUsername(username)
			.catch(() => {
				throw new UserControllerExceptions.InvalidUsernameOrPassword();
			});

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new UserControllerExceptions.InvalidUsernameOrPassword();
		}

		const accessToken = await this.userRepository.createAccessAndRefreshToken(
			user
		);
		return accessToken;
	}

	async refreshToken(username: string): Promise<string> {
		const user = await this.userRepository
			.getUserByUsername(username)
			.catch(() => {
				throw new UserControllerExceptions.UserNotFound();
			});

		if (!user.refreshToken) {
			throw new UserControllerExceptions.RefreshTokenNotPresent();
		}

		verifyRefreshToken(user.refreshToken).catch(() => {
			throw new UserControllerExceptions.InvalidRefreshToken();
		});

		return generateAccessToken(user);
	}

	async logout(username: string): Promise<void> {
		await this.userRepository.deleteRefreshTokenOfUser(username).catch(() => {
			throw new UserControllerExceptions.UserNotFound();
		});
	}
}
