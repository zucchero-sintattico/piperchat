import { Request } from "express";
import jwt from "jsonwebtoken";

type UserJWTInfo = {
	id: string;
	username: string;
	email: string;
};

declare global {
	namespace Express {
		interface Request {
			user: UserJWTInfo;
		}
	}
}

export const generateAccessToken = (user: any) => {
	return jwt.sign(
		{ username: user.username, email: user.email, id: user._id } as UserJWTInfo,
		process.env.ACCESS_TOKEN_SECRET || "access",
		{ expiresIn: "15s" }
	);
};

export const verifyAccessToken = async (token: string) => {
	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "access");
};

export const generateRefreshToken = (user: any) => {
	return jwt.sign(
		{ username: user.username, email: user.email, id: user._id } as UserJWTInfo,
		process.env.REFRESH_TOKEN_SECRET || "refresh",
		{ expiresIn: "1d" }
	);
};

export const verifyRefreshToken = async (token: string) => {
	return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "refresh");
};

export const jwtValidTokenRequired = (req: Request, res: any, next: any) => {
	console.log("[JWT-Middleware] - Checking if JWT Token is valid");
	const accessToken = req.cookies.jwt;
	if (!accessToken) {
		return res
			.status(401)
			.json({ message: "JWT Token Missing - Unauthorized" });
	}
	try {
		const decoded = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET || "access"
		) as any;
		console.log("Decoded JWT Token:", decoded);
		req.user = {
			id: decoded.id,
			username: decoded.username,
			email: decoded.email,
		};
		next();
	} catch (e) {
		return res
			.status(401)
			.json({ message: "JWT Token Invalid - Unauthorized", error: e });
	}
};

export const jwtInvalidTokenRequired = (req: Request, res: any, next: any) => {
	console.log("[JWT-Middleware] - Checking if JWT Token is invalid");
	const accessToken = req.cookies.jwt;
	if (!accessToken) {
		return res
			.status(401)
			.json({ message: "JWT Token Missing - Unauthorized" });
	}
	try {
		jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || "access");
		return res
			.status(401)
			.json({ message: "JWT Token Valid Yet - Unauthorized" });
	} catch (e) {
		const user = jwt.decode(accessToken) as any;
		req.user = {
			id: user.id,
			username: user.username,
			email: user.email,
		};
		next();
	}
};
