import { Request, Router, Response } from "express";
import { UserStatusController, UserStatusControllerImpl } from "../../controllers/user-status-controller";
import { jwtValidTokenRequired } from "../../utils/jwt";

const userStatusController: UserStatusController = new UserStatusControllerImpl();

export const userStatusRouter = Router();
userStatusRouter.use(jwtValidTokenRequired);

userStatusRouter.get("/", async (req: Request, res: Response) => {
    try {
        const user = await userStatusController.getStatus(req.user.username);
        if (user?.status === "online") {
            res.status(200).json({ status: "online" });
        } else {
            res.status(200).json({ status: "offline", lastActive: user.lastActive });
        }
    } catch (e: any) {
        res.status(404).json({ error: "User not found" });
    }
});