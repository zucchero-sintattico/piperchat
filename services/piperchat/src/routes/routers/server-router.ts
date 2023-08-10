import { Request, Response, Router } from "express";
import { ServerController } from "@/controllers/server/server-controller";
import { ServerControllerImpl } from "@/controllers/server/server-controller-impl";

const serverController: ServerController = new ServerControllerImpl();
export const serverRouter = Router();

serverRouter.get("/", async (req: Request, res: Response) => {
	serverController
		.getServer(req.body.id)
		.then((server) => {
			res.status(200).json(server);
		})
		.catch((err) => {
			res.status(404).json(err);
		});
});

serverRouter.get("/all", async (req: Request, res: Response) => {
	serverController
		.getServers(req.body.username)
		.then((servers) => {
			res.status(200).json(servers);
		})
		.catch((err) => {
			res.status(404).json(err);
		});
});

serverRouter.post("/create", async (req: Request, res: Response) => {
	serverController
		.createServer(req.body.name, req.body.description, req.user.username)
		.then((server) => {
			res.status(200).json(server);
		})
		.catch((err) => {
			res.status(404).json(err);
		});
});

serverRouter.post("/update", async (req: Request, res: Response) => {
	serverController
		.updateServer(req.body.id, req.body.name, req.body.description)
		.then((server) => {
			res.status(200).json(server);
		})
		.catch((err) => {
			res.status(404).json(err);
		});
});

serverRouter.post("/delete", async (req: Request, res: Response) => {
	serverController
		.deleteServer(req.body.id)
		.then((server) => {
			res.status(200).json(server);
		})
		.catch((err) => {
			res.status(404).json(err);
		});
});

serverRouter.post("/join", async (req: Request, res: Response) => {
	serverController
		.joinServer(req.body.id)
		.then((server) => {
			res.status(200).json(server);
		})
		.catch((err) => {
			res.status(404).json(err);
		});
});

serverRouter.post("/leave", async (req: Request, res: Response) => {
	serverController
		.leaveServer(req.body.id)
		.then((server) => {
			res.status(200).json(server);
		})
		.catch((err) => {
			res.status(404).json(err);
		});
});
