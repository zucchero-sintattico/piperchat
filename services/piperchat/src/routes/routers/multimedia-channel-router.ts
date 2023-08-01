import { Request, Response, Router } from "express";
import { MessageChannelController } from "../../controllers/message-channel/message-channel-controller";
import { MessageChannelControllerImpl } from "../../controllers/message-channel/message-channel-controller-impl";

export const multimediaChannelRouter = Router();
const multimediaChannelController: MessageChannelController =
	new MessageChannelControllerImpl();

multimediaChannelRouter.post("/create", async (req: Request, res: Response) => {
	if (!req.body.serverId) {
		res.status(400).send("serverId not provided");
		return;
	}
	if (!req.body.name) {
		res.status(400).send("name not provided");
		return;
	}
	multimediaChannelController
		.createMessageChannel(req.body.serverId, req.body.name)
		.then((messageChannel) => {
			res.status(200).send(messageChannel);
		})
		.catch((err) => {
			res.status(400).send(err);
		});
});

multimediaChannelRouter.post("/update", async (req: Request, res: Response) => {
	if (!req.body.id) {
		res.status(400).send("id not provided");
		return;
	}
	multimediaChannelController
		.updateMessageChannel(req.body.id, req.body.name)
		.then((messageChannel) => {
			res.status(200).send(messageChannel);
		})
		.catch((err) => {
			res.status(400).send(err);
		});
});

multimediaChannelRouter.post("/delete", async (req: Request, res: Response) => {
	if (!req.body.id) {
		res.status(400).send("id not provided");
		return;
	}
	multimediaChannelController
		.deleteMessageChannel(req.body.id)
		.then((messageChannel) => {
			res.status(200).send(messageChannel);
		})
		.catch((err) => {
			res.status(400).send(err);
		});
});
