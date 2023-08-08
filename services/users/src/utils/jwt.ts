import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user-model";

/**
 * JWT Token Info
 * @param username Username of the user
 * @param email Email of the user
 */
type UserJWTInfo = {
	username: string;
	email: string;
};

/**
 * Augment Express Request
 * @param user User info embedded in the JWT Token
 */
declare global {
	namespace Express {
		interface Request {
			user: UserJWTInfo;
		}
	}
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh";

/**
 * Generate a JWT Access Token for the user
 * @param user User to generate the token
 * @param expiresIn Expiration time, default 1 day
 * @returns JWT Access Token
 */
export const generateAccessToken = (user: User, expiresIn: string = "1d") => {
	return jwt.sign(
		{ username: user.username, email: user.email } as UserJWTInfo,
		ACCESS_TOKEN_SECRET,
		{ expiresIn: expiresIn }
	);
};

/**
 * Generate a JWT Refresh Token for the user
 * @param user User to generate the token
 * @param expiresIn Expiration time, default 1 week
 * @returns JWT Refresh Token
 */
export const generateRefreshToken = (user: User, expiresIn: string = "1w") => {
	return jwt.sign(
		{ username: user.username, email: user.email } as UserJWTInfo,
		REFRESH_TOKEN_SECRET,
		{ expiresIn: expiresIn }
	);
};

/**
 * Verify a JWT Access Token
 * @param token JWT Access Token
 * @returns Decoded JWT Access Token
 * @throws Error if the token is invalid
 * @throws Error if the token is expired
 */
export const verifyAccessToken = async (token: string) => {
	return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

/**
 * Verify a JWT Refresh Token
 * @param token JWT Refresh Token
 * @returns Decoded JWT Refresh Token
 * @throws Error if the token is invalid
 * @throws Error if the token is expired
 */
export const verifyRefreshToken = async (token: string) => {
	return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

/**
 * Middleware to check if the JWT Access Token is present and valid
 * @param req Express Request
 * @param res Express Response
 * @param next Express Next Function
 * @returns 401 if the JWT Access Token is missing
 * @returns 401 if the JWT Access Token is invalid
 * @returns 401 if the JWT Access Token is expired
 */
export const JWTAuthenticationMiddleware = (
	req: Request,
	res: Response,
	next: any
) => {
	const accessToken = req.cookies.jwt;
	if (!accessToken) {
		return res
			.status(401)
			.json({ message: "JWT Token Missing - Unauthorized" });
	}
	try {
		req.user = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as UserJWTInfo;
		next();
	} catch (e) {
		return res
			.status(401)
			.json({ message: "JWT Token Invalid - Unauthorized", error: e });
	}
};

/**
 * Middleware to check if the JWT Access Token is present and expired
 * This middleware is used to check if the user can refresh the token
 * @param req Express Request
 * @param res Express Response
 * @param next Express Next Function
 * @returns 401 if the JWT Access Token is missing
 * @returns 400 if the JWT Access Token is valid
 */
export const JWTRefreshTokenMiddleware = (
	req: Request,
	res: Response,
	next: any
) => {
	const accessToken = req.cookies.jwt;
	if (!accessToken) {
		return res
			.status(401)
			.json({ message: "JWT Token Missing - Unauthorized" });
	}
	try {
		const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as UserJWTInfo;
		return res.status(400).json({
			message:
				"In order to refresh the token, you must have an expired Access Token",
		});
	} catch (e) {
		next();
	}
};
