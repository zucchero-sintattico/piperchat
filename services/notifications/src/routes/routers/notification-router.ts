import { log } from "console";
import { Request, Router, Response } from "express";

// const notificationController: NotificationController = new NotificationControllerImpl();

export const notificationRouter = Router();

notificationRouter.get("/", async (req: Request, res: Response) => {
	const headers = {
		'Content-Type': 'text/event-stream',
		'Connection': 'keep-alive',
		'Cache-Control': 'no-cache',
	};
	res.writeHead(200, headers);
	const data = `data: ${JSON.stringify({ hello: "world" })}\n\n`;
	res.write(data);
});
