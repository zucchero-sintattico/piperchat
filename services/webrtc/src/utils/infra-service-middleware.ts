import { Request, Response } from "express";

export const infraServiceMiddleware = (
	req: Request,
	res: Response,
	next: () => void
) => {
	console.log("Infra service middleware");
	const secret = process.env.INFRA_SERVICES_SECRET || "secret";
	const header = req.headers["infra-services-secret"];
	if (header !== secret) {
		res.status(403).send("Forbidden, this is an infra service endpoint");
		return;
	}
	next();
};
