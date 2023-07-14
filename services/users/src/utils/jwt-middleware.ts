import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const jwtMiddleware = (req: any, res: Response, next: any) => {
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
		);
		req.user = decoded;
		next();
	} catch (e) {
		return res
			.status(401)
			.json({ message: "JWT Token Invalid - Unauthorized", error: e });
	}
};
