import { Router } from "express";
import { DirectController } from "../controllers/direct/direct-controller";
import { DirectControllerImpl } from "../controllers/direct/direct-controller-impl";
import { jwtValidTokenRequired } from "../utils/jwt";

const directController: DirectController = new DirectControllerImpl();
const directRouter = Router();
directRouter.use(jwtValidTokenRequired);



directRouter.get("/:username/messages", async (req, res) => {
    const username1 = req.user.username;
    const username2 = req.params.username;
    const from = parseInt(req.query.from as string);
    const limit = parseInt(req.query.limit as string);
    const messages = await directController.getDirectMessagesPaginated(username1, username2, from, limit);
    res.status(200).json(messages);
});


directRouter.post("/:username/messages", async (req, res) => {
    const username1 = req.user.username;
    const username2 = req.params.username;
    const message = req.body.message;
    await directController.sendDirectMessage(username1, username2, message);
    res.status(200).json({ message: "Message sent" });
});

export { directRouter as DirectRouter };
