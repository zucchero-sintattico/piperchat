import { User } from "../models/user-model";
import { Request, Response } from "express";
import { UserEventsRepository } from "../events/repositories/user-events-repository";
import { UserRepository } from "../repositories/user-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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
		const salt = await bcrypt.genSalt(10);
		console.log(password, salt);
		const hashedPassword = await bcrypt.hash(password, salt);
		const user = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});
		try {
			await this.userRepository.createUser(user);
			res.json(user);
		} catch (err) {
			return res.status(400).send(err);
		}
	}


	async login(req: Request, res: Response) {
		const user = await this.userRepository.getUserByUsername(req.body.username);
		
		if (!user) {
			return res.status(400).send("Username or password is wrong");
		}
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword) {
			return res.status(400).send("Username or password is wrong");
		}

		const accessToken = jwt.sign({ username: user.username, email: user.email, id: user._id },
			process.env.ACCESS_TOKEN_SECRET || "access", { expiresIn: "15s" });

		user.refreshToken = jwt.sign({ username: user.username, email: user.email, id: user._id },
			process.env.REFRESH_TOKEN_SECRET || "refresh", { expiresIn: "15s" });
		user.save();
		

		res.cookie("jwt", accessToken, { httpOnly: true });

	}


	async refreshToken(req: Request, res: Response) {
		 const refreshToken = await this.userRepository.getRefreshTokenFromUser(req.body.username);
		if (!refreshToken) {
			return res.status(401).send("Refresh token not found");
		}
		jwt.verify(refreshToken,
			process.env.REFRESH_TOKEN_SECRET || "refresh",
			(err: any, user: any) => {
				if (err) {
					return res.status(403).send("Refresh token not valid");
				}
				const accessToken = jwt.sign(
					{ username: user.username, email: user.email, id: user._id },
					process.env.ACCESS_TOKEN_SECRET || "access",
					{ expiresIn: "15s" }
				);
				res.json({ accessToken: accessToken });
			}
		);
	}




			
			

	async logout(req: Request, res: Response) {	
		res.clearCookie("jwt").send("Logged out");
	}

		
}
