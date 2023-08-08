import { UserEventsRepository } from "../../events/repositories/user/user-events-repository";
import { User } from "../../models/user-model";
import { UserRepository } from "../../repositories/user/user-repository";
import { UserRepositoryImpl } from "../../repositories/user/user-repository-impl";
import { AuthController, AuthControllerExceptions } from "./auth-controller";
import bcrypt from "bcrypt";
import {
	generateAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
} from "../../../../commons/utils/jwt";
import { UserEventsRepositoryImpl } from "../../events/repositories/user/user-events-repository-impl";

export class AuthControllerImpl implements AuthController {
	private userRepository: UserRepository = new UserRepositoryImpl();
	private userEventsRepository: UserEventsRepository =
		new UserEventsRepositoryImpl();

	async register(
		username: string,
		email: string,
		password: string,
		description: string | null,
		photo: Buffer | null
	): Promise<User> {
		const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
		const user = await this.userRepository
			.createUser(username, email, hashedPassword, description, photo)
			.catch(() => {
				throw new AuthControllerExceptions.UserAlreadyExists();
			});
		await this.userEventsRepository.publishUserCreated(user);
		return user;
	}

	async login(username: string, password: string): Promise<string> {
		const user = await this.userRepository
			.getUserByUsername(username)
			.catch(() => {
				throw new AuthControllerExceptions.InvalidUsernameOrPassword();
			});

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new AuthControllerExceptions.InvalidUsernameOrPassword();
		}

		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		await this.userRepository.login(user.username, refreshToken);
		return accessToken;
	}

	async refreshToken(username: string): Promise<string> {
		const user = await this.userRepository
			.getUserByUsername(username)
			.catch(() => {
				throw new AuthControllerExceptions.UserNotFound();
			});

		if (!user.refreshToken) {
			throw new AuthControllerExceptions.RefreshTokenNotPresent();
		}

		verifyRefreshToken(user.refreshToken).catch(() => {
			throw new AuthControllerExceptions.InvalidRefreshToken();
		});

		return generateAccessToken(user);
	}

	async logout(username: string): Promise<void> {
		await this.userRepository.logout(username).catch(() => {
			throw new AuthControllerExceptions.UserNotFound();
		});
	}
}
