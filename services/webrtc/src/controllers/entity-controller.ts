import { Session } from "../models/session-model";
import { Request, Response } from "express";
import { SessionEventsRepository } from "../events/repositories/session-events-repository";
import { SessionRepository } from "../repositories/session-repository";

export class SessionController {
	// The repository is a private property of the controller.
	private sessionRepository: SessionRepository = new SessionRepository();
	private sessionEventsRepository: SessionEventsRepository =
		new SessionEventsRepository();
}
