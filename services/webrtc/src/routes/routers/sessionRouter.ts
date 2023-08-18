import { Request, Response, Router } from "express";
import {
	SessionController,
	SessionControllerExceptions,
} from "../../controllers/session/session-controller";
import { SessionControllerImpl } from "../../controllers/session/session-controller-impl";

export const sessionRouter = Router();
const sessionController: SessionController = new SessionControllerImpl();

sessionRouter.post("/", async (req: Request, res: Response) => {
	if (
		!req.body.allowedUsers ||
		!Array.isArray(req.body.allowedUsers) ||
		req.body.allowedUsers.length === 0
	) {
		res.status(400).send("Bad request, allowedUsers must be a non-empty array");
		return;
	}
	try {
		const session = await sessionController.createSession(
			req.body.allowedUsers
		);
		return res.status(201).send(session);
	} catch (err: any) {
		console.error(err);
		return res
			.status(500)
			.send({ message: "Internal server error", error: err });
	}
});

sessionRouter.put("/:id", async (req: Request, res: Response) => {
	if (
		!req.body.allowedUsers ||
		!Array.isArray(req.body.allowedUsers) ||
		req.body.allowedUsers.length === 0
	) {
		res.status(400).send("Bad request, allowedUsers must be a non-empty array");
		return;
	}
	try {
		await sessionController.updateSession(req.params.id, req.body.allowedUsers);
		return res.status(200).send();
	} catch (err: any) {
		console.error(err);
		if (err instanceof SessionControllerExceptions.SessionNotFound) {
			return res.status(404).send({ message: "Session not found", error: err });
		}
		return res
			.status(500)
			.send({ message: "Internal server error", error: err });
	}
});
