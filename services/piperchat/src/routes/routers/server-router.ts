import { Request, Response, Router } from "express";
import {
  ServerController,
  ServerControllerExceptions,
} from "../../controllers/server/server-controller";
import { ServerControllerImpl } from "../../controllers/server/server-controller-impl";

const serverController: ServerController = new ServerControllerImpl();
export const serverRouter = Router();

serverRouter.delete(
  "/:serverId/partecipants/:username",
  async (req: Request, res: Response) => {
    try {
      await serverController.kickUserFromTheServer(
        req.params.serverId,
        req.params.username,
        req.user.username
      );
      res.status(200).json({ message: "User kicked successfully" });
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        return res.status(404).json({ message: "User not found", error: e });
      }
      if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
        return res.status(403).json({
          message: "You don't have permissions to access this resource",
          error: e,
        });
      }
      if (e instanceof ServerControllerExceptions.OwnerCannotLeave) {
        return res.status(422).json({
          message: "Unprocessable entity: the user is the owner of the server",
          error: e,
        });
      }
      return res
        .status(500)
        .json({ message: "Internal server error", error: e });
    }
  }
);

serverRouter
  .get("/:serverId/partecipants", async (req: Request, res: Response) => {
    try {
      const partecipants = await serverController.getServerParticipants(
        req.params.serverId,
        req.user.username
      );
      res.status(200).json({ partecipants: partecipants });
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        return res.status(404).json({ message: "User not found", error: e });
      }
      if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
        return res.status(403).json({
          message: "You don't have permissions to access this resource",
          error: e,
        });
      }
      return res
        .status(500)
        .json({ message: "Internal server error", error: e });
    }
  })
  .post("/:serverId/partecipants", async (req: Request, res: Response) => {
    try {
      await serverController.joinServer(req.params.serverId, req.user.username);
      res.status(200).json({ message: "Server joined successfully" });
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        return res.status(404).json({ message: "User not found", error: e });
      }
      return res
        .status(500)
        .json({ message: "Internal server error", error: e });
    }
  })
  .delete("/:serverId/partecipants", async (req: Request, res: Response) => {
    try {
      await serverController.leaveServer(
        req.params.serverId,
        req.user.username
      );
      res.status(200).json({ message: "Server left successfully" });
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        return res.status(404).json({ message: "User not found", error: e });
      }
      if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
        return res.status(403).json({
          message: "You don't have permissions to access this resource",
          error: e,
        });
      }
      if (e instanceof ServerControllerExceptions.OwnerCannotLeave) {
        return res.status(422).json({
          message: "Unprocessable entity: the user is the owner of the server",
          error: e,
        });
      }
      return res
        .status(500)
        .json({ message: "Internal server error", error: e });
    }
  });

serverRouter
  .get("/:serverId", async (req: Request, res: Response) => {
    try {
      const server = await serverController.getServer(req.params.serverId);
      res.status(200).json({ server: server });
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        return res.status(404).json({ message: "User not found", error: e });
      }
      return res
        .status(500)
        .json({ message: "Internal server error", error: e });
    }
  })
  .put("/:serverId", async (req: Request, res: Response) => {
    if (req.body.name == undefined && req.body.description == undefined) {
      return res.status(400).json({ message: "Bad request" });
    }
    try {
      await serverController.updateServer(
        req.params.serverId,
        req.user.username,
        req.body.name,
        req.body.description
      );
      res.status(200).json({ message: "Server updated successfully" });
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        return res.status(404).json({ message: "User not found", error: e });
      }
      if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
        return res.status(403).json({
          message: "You don't have permissions to access this resource",
          error: e,
        });
      }
      return res
        .status(500)
        .json({ message: "Internal server error", error: e });
    }
  })
  .delete("/:serverId", async (req: Request, res: Response) => {
    try {
      await serverController.deleteServer(
        req.params.serverId,
        req.user.username
      );
      res.status(200).json({ message: "Server deleted successfully" });
    } catch (e) {
      if (e instanceof ServerControllerExceptions.ServerNotFound) {
        return res.status(404).json({ message: "User not found", error: e });
      }
      if (e instanceof ServerControllerExceptions.UserNotAuthorized) {
        return res.status(403).json({
          message: "You don't have permissions to access this resource",
          error: e,
        });
      }
      return res
        .status(500)
        .json({ message: "Internal server error", error: e });
    }
  });

serverRouter
  .get("/", async (req: Request, res: Response) => {
    try {
      const servers = await serverController.getServers(req.user.username);
      res.status(200).json({ servers: servers });
    } catch (e) {
      if (e instanceof ServerControllerExceptions.UserNotFound) {
        return res.status(404).json({ message: "User not found", error: e });
      }
      return res
        .status(500)
        .json({ message: "Internal server error", error: e });
    }
  })
  .post("/", async (req: Request, res: Response) => {
    if (req.body.name == undefined || req.body.description == undefined) {
      return res.status(400).json({ message: "Bad Request" });
    }
    try {
      await serverController.createServer(
        req.body.name,
        req.body.description,
        req.user.username
      );
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: e });
    }
  });
