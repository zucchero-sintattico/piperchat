import { Router } from "express";
import { JWTAuthenticationMiddleware } from "@piperchat/commons";
import { ChannelController, ChannelControllerExceptions } from "@controllers/channel/channel-controller";
import { ChannelControllerImpl } from "@controllers/channel/channel-controller-impl";

const channelController: ChannelController = new ChannelControllerImpl();
const channelRouter = Router();
channelRouter.use(JWTAuthenticationMiddleware);


channelRouter.get(":serverId/channels/:channelId/messages", async (req, res) => {
    try {
        const serverId = req.params.serverId;
        const channelId = req.params.channelId;
        const from = parseInt(req.query.from as string);
        const limit = parseInt(req.query.limit as string);
        const messages = await channelController.getChannelMessagesPaginated(serverId, channelId, from, limit);
        res.status(200).json(messages);
    } catch (e) {
        if (e instanceof ChannelControllerExceptions.ChannelNotFound) {
            res.status(404).json({ message: "Channel not found" });
        }
        else if (e instanceof ChannelControllerExceptions.ServerNotFound) {
            res.status(404).json({ message: "Server not found" });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }

});

channelRouter.post(":serverId/channels/:channelId/messages", async (req, res) => {
    try {
        const serverId = req.params.serverId;
        const channelId = req.params.channelId;
        const sender = req.user.username;
        const content = req.body.content;
        await channelController.sendMessage(channelId, serverId, sender, content);
        res.status(200).json({ message: "Message sent" });
    } catch (e) {
        if (e instanceof ChannelControllerExceptions.ChannelNotFound) {
            res.status(404).json({ message: "Channel not found" });
        }
        else if (e instanceof ChannelControllerExceptions.ServerNotFound) {
            res.status(404).json({ message: "Server not found" });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});




export { channelRouter as ChannelRouter };
