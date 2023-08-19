import { Router, Request, Response } from "express";
import { ChannelController } from "@controllers/channel/channel-controller";
import { ChannelControllerImpl } from "@controllers/channel/channel-controller-impl";
import { ServerControllerExceptions } from "@controllers/server/server-controller";

const channelController: ChannelController = new ChannelControllerImpl();
export const channelRouter = Router();

channelRouter.get("/", async (req: Request, res: Response) => {
  try {
    const channels = await channelController.getChannels(
      req.params.serverId,
      req.user.username
    );
    res.status(200).json(channels);
  } catch (e) {
    if (e instanceof ServerControllerExceptions.ServerNotFound) {
      return res.status(404).json({ message: "Server not found", error: e });
    }
    if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
      return res.status(403).json({
        message: "You don't have permissions to access this resource",
        error: e,
      });
    }
    return res.status(500).json({ message: "Internal server error", error: e });
  }
});

channelRouter.post("/", async (req: Request, res: Response) => {
  if (
    !req.body.name ||
    req.body.name === "" ||
    !req.body.channelType ||
    req.body.channelType === ""
  ) {
    return res.status(400).json({ message: "Bad request: missing name" });
  }
  try {
    await channelController.createChannel(
      req.params.serverId,
      req.user.username,
      req.body.name,
      req.body.channelType,
      req.body.description
    );
    res.status(200).json({ message: "Channel created successfully" });
  } catch (e) {
    if (e instanceof ServerControllerExceptions.ServerNotFound) {
      return res.status(404).json({ message: "Server not found", error: e });
    }
    if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
      return res.status(403).json({
        message: "You don't have permissions to access this resource",
        error: e,
      });
    }
    return res.status(500).json({ message: "Internal server error", error: e });
  }
});
