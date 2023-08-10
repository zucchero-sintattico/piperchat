import { Request, Response, Router } from "express";
import { MessageChannelController } from "@/controllers/message-channel/message-channel-controller";
import { MessageChannelControllerImpl } from "@/controllers/message-channel/message-channel-controller-impl";

export const messageChannelRouter = Router();
const messageChannelController: MessageChannelController =
	new MessageChannelControllerImpl();

messageChannelRouter
	.route("/create")
	.post(async (req: Request, res: Response) => {
		if (!req.body.serverId || !req.body.name) {
			res.status(400).json({ error: "Missing serverId or name" });
			return;
		}
		messageChannelController
			.createMessageChannel(req.body.serverId, req.body.name)
			.then((messageChannel) => {
				res.status(200).json(messageChannel);
			})
			.catch((err) => {
				res.status(400).json(err);
			});
	});

messageChannelRouter
	.route("/update")
	.post(async (req: Request, res: Response) => {
		if (!req.body.id) {
			res.status(400).json({ error: "Missing id" });
			return;
		}
		messageChannelController
			.updateMessageChannel(req.body.id, req.body.name)
			.then((messageChannel) => {
				res.status(200).json(messageChannel);
			})
			.catch((err) => {
				res.status(400).json(err);
			});
	});

messageChannelRouter
	.route("/delete")
	.post(async (req: Request, res: Response) => {
		if (!req.body.id) {
			res.status(400).json({ error: "Missing id" });
			return;
		}
		messageChannelController
			.deleteMessageChannel(req.body.id)
			.then((messageChannel) => {
				res.status(200).json(messageChannel);
			})
			.catch((err) => {
				res.status(400).json(err);
			});
	});
