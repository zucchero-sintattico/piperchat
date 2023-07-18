import { Router } from "express";
import { ServerController } from "../controllers/server-controller";

const serverController = new ServerController();
/**
 * The router of a generic entity.
 */
const serverRouter = Router();

serverRouter
  .route("/servers")
  .get(serverController.getAllServers.bind(serverController))
  .post(serverController.createServer.bind(serverController));

serverRouter
  .route("/servers/:id")
  .get(serverController.getServerById.bind(serverController))
  .put(serverController.updateServer.bind(serverController))
  .delete(serverController.deleteServer.bind(serverController));

serverRouter
  .route("/servers/:name/:username")
  .get(serverController.getServerByUsername.bind(serverController))
  .post(serverController.addMember.bind(serverController))
  .delete(serverController.removeMember.bind(serverController));

serverRouter
  .route("/servers/:name/:channel")
  .post(serverController.addChannel.bind(serverController))
  .delete(serverController.removeChannel.bind(serverController));

export { serverRouter as entityRouter };
