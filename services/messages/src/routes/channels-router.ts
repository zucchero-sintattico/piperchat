import { Router } from "express";
import { jwtValidTokenRequired } from "../utils/jwt";
import { ChannelController } from "../controllers/channel/channel-controller";
import { ChannelControllerImpl } from "../controllers/channel/channel-controller-impl";

const channelController: ChannelController = new ChannelControllerImpl();
const channelRouter = Router();
channelRouter.use(jwtValidTokenRequired);


channelRouter.get(":serverId/channels/:channelId/messages", async (req, res) => {
    const serverId = req.params.serverId;
    const channelId = req.params.channelId;
    const from = parseInt(req.query.from as string);
    const limit = parseInt(req.query.limit as string);
    const messages = await channelController.getChannelMessagesPaginated(serverId, channelId, from, limit);
    res.status(200).json(messages);
});




export { channelRouter as ChannelRouter };
