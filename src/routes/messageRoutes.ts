import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth";
import { ErrorHandler } from "../schema/errorHandler";
import { UserChatRoomMiddleware } from "../middlewares/userChatRoom";
import {
  addMessage,
  DeleteMessage,
  getMessages,
  updateMessage,
} from "../controllers/MessageController";
import { OwnerMessageMiddleware } from "../middlewares/ownerMessage";

const messageRoutes = Router({ mergeParams: true });

messageRoutes.get(
  "/",
  [AuthMiddleware, UserChatRoomMiddleware],
  ErrorHandler(getMessages)
);
messageRoutes.post(
  "/add",
  [AuthMiddleware, UserChatRoomMiddleware],
  ErrorHandler(addMessage)
);
messageRoutes.put(
  "/:messageId",
  [AuthMiddleware, OwnerMessageMiddleware],
  ErrorHandler(updateMessage)
);
messageRoutes.delete(
  "/:messageId",
  [AuthMiddleware, OwnerMessageMiddleware],
  ErrorHandler(DeleteMessage)
);

export default messageRoutes;
