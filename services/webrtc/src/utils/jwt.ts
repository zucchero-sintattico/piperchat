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

export const isAccessTokenValid = (accessToken: string) => {
	try {
		jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || "access");
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
};

export const decodeAccessToken = (accessToken: string): UserJWTInfo | null => {
	try {
		const decoded = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET || "access"
		) as any;
		return {
			id: decoded.id,
			username: decoded.username,
			email: decoded.email,
		};
	} catch (e) {
		return null;
	}
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
