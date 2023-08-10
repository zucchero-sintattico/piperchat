import { Request, Router, Response } from "express";
import { notificationRouter } from "./routers/notification-router";
import { userStatusRouter } from "./routers/user-status-router";
import { notifiableUsers } from "../models/notification-model";

const serviceRouter = Router();

serviceRouter.use("/notification", notificationRouter);
serviceRouter.use("/users", userStatusRouter);

serviceRouter.get("/", (req, res) => {
    res.sendFile("client.html", { root: __dirname + "/../../" });
});

serviceRouter.get("/send", (req, res) => {
    notifiableUsers.notify("user1", { message: "Hello from the server" });
    res.status(200).json({ message: "Message sent" });
});

export { serviceRouter };
