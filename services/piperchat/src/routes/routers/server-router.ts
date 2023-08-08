import { Request, Response, Router } from "express";
import {
  ServerController,
  ServerControllerExceptions,
} from "../../controllers/server/server-controller";
import { ServerControllerImpl } from "../../controllers/server/server-controller-impl";

const serverController: ServerController = new ServerControllerImpl();
export const serverRouter = Router();

serverRouter
  .get("/:serverId", async (req: Request, res: Response) => {
    try {
      const server = await serverController.getServer(
        Number(req.params.serverId)
      );
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
        Number(req.params.serverId),
        req.body.username,
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
        Number(req.params.serverId),
        req.body.username
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
      const servers = await serverController.getServers(req.body.username);
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
        req.body.username
      );
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: e });
    }
  });
