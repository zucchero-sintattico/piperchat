import { Router } from "express";
import { ChannelController } from "../controllers/channel-controller";

const channelRouter = Router();
const channelController = new ChannelController();
// TODO: ServerRoutes, ChannelRoutes, MessageRoutes, ConversationRoutes

channelRouter
  .route("/messages")
  .get(channelController.getAllChannels.bind(channelController))
  .post(channelController.createChannel.bind(channelController));

channelRouter
  .route("/messages/:username")
  .get(channelController.getChannelByUsername.bind(channelController))
  .post(channelController.addMember.bind(channelController))
  .delete(channelController.removeMember.bind(channelController));

channelRouter
  .route("/messages/:name")
  .put(channelController.updateChannel.bind(channelController))
  .delete(channelController.deleteChannel.bind(channelController));

export { channelRouter };
