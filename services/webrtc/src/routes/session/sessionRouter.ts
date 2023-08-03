import { Request, Response, Router } from "express";
import {
	SessionController,
	SessionControllerExceptions,
} from "../../controllers/session/session-controller";
import { SessionControllerImpl } from "../../controllers/session/session-controller-impl";

export const sessionRouter = Router();
const sessionController: SessionController = new SessionControllerImpl();

sessionRouter.post("/", (req: Request, res: Response) => {
	if (
		!req.body.allowedUsers ||
		!Array.isArray(req.body.allowedUsers) ||
		req.body.allowedUsers.length === 0
	) {
		res.status(400).send("Bad request, allowedUsers must be a non-empty array");
		return;
	}
	sessionController
		.createSession(req.body.allowedUsers)
		.then((session) => {
			res.status(201).send(session);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send({ message: "Internal server error", error: err });
		});
});

sessionRouter.put("/:id", (req: Request, res: Response) => {
	if (
		!req.body.allowedUsers ||
		!Array.isArray(req.body.allowedUsers) ||
		req.body.allowedUsers.length === 0
	) {
		res.status(400).send("Bad request, allowedUsers must be a non-empty array");
		return;
	}
	sessionController
		.updateSession(req.params.id, req.body.allowedUsers)
		.then(() => {
			res.status(200).send();
		})
		.catch((err) => {
			console.error(err);
			if (err instanceof SessionControllerExceptions.SessionNotFound) {
				res.status(404).send({ message: "Session not found", error: err });
				return;
			}
			res.status(500).send({ message: "Internal server error", error: err });
		});
});
