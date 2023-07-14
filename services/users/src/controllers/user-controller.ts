import { User } from "../models/user-model";
import { Request, Response } from "express";
import { UserEventsRepository } from "../events/repositories/user-events-repository";
import { UserRepository } from "../repositories/user-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { decode } from "punycode";
import { generateAccessToken } from "../utils/jwt";

/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
export class UserController {
	// The repository is a private property of the controller.
	private userRepository: UserRepository = new UserRepository();

	// The events repository is a private property of the controller.
	private userEventsRepository: UserEventsRepository =
		new UserEventsRepository();

	async register(req: Request, res: Response) {
		const password = req.body.password;
		const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
		const user = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});
		try {
			await this.userRepository.createUser(user);
			await this.userEventsRepository.publishUserCreated(user);
			res.json(user);
		} catch (err) {
			return res.status(400).send(err);
		}
	}

	async login(req: Request, res: Response) {
		// Retrieve the user from the database
		const user = await this.userRepository.getUserByUsername(req.body.username);
		if (!user) {
			return res.status(400).send("Username or password is wrong");
		}

		// Check if the password is correct
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword) {
			return res.status(400).send("Username or password is wrong");
		}

		// Create and send the access token
		const accessToken = await this.userRepository.createAccessAndRefreshToken(
			user
		);
		res.cookie("jwt", accessToken, { httpOnly: true, secure: true }).send();
	}

	async refreshToken(req: Request, res: Response) {
		const user = req.user;

		// Retrieve the refresh token from the database
		const refreshToken = await this.userRepository.getRefreshTokenFromUser(
			user.username
		);
		if (!refreshToken) {
			return res.status(403).send("Refresh token not valid");
		}

		// Check if the refresh token is valid and create a new access token
		try {
			jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "refresh");
			const accessToken = generateAccessToken(user);
			console.log("New Access token:", accessToken);
			res.cookie("jwt", accessToken, { httpOnly: true, secure: true }).send();
		} catch (err) {
			return res.status(403).send("Refresh token not valid");
		}
	}

	async logout(req: Request, res: Response) {
		const user = req.user;
		if (!user) {
			return res.status(403).send("Access token not valid");
		}
		this.userRepository.deleteRefreshTokenOfUser(user.username);

		res.clearCookie("jwt").status(200).send();
	}
}
