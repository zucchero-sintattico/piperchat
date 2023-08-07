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
		req.user = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET || "access"
		) as UserJWTInfo;
		next();
	} catch (e) {
		return res
			.status(401)
			.json({ message: "JWT Token Invalid - Unauthorized", error: e });
	}
};
