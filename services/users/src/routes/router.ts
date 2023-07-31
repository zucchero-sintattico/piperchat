import { Router } from "express";
import { userRouter } from "./user-router";
import { authRouter } from "./auth-router";
import { friendsRouter } from "./friends-router";

const serviceRouter = Router();

serviceRouter.use("/auth", authRouter);
serviceRouter.use("/user", userRouter);
serviceRouter.use("/friends", friendsRouter);

export { serviceRouter };
