import { Router } from "express";
import { usersRouter } from "./routers/user-router";
import { authRouter } from "./routers/auth-router";
import { friendsRouter } from "./routers/friends-router";

const serviceRouter = Router();

serviceRouter.use("/auth", authRouter);
serviceRouter.use("/users", usersRouter);
serviceRouter.use("/friends", friendsRouter);

export { serviceRouter };
