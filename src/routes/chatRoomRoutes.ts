import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth";
import { ErrorHandler } from "../schema/errorHandler";
import {
  createChatRoom,
  DeleteChatRoom,
  getChatRoomById,
  getChatRooms,
  updateChatRoom,
} from "../controllers/ChatRoomController";
import { OwnerChatRoomMiddleware } from "../middlewares/ownerChatRoom";
import userChatRoomRoutes from "./usreChatRoomRoutes";
import messageRoutes from "./messageRoutes";

const chatRoutes = Router();

chatRoutes.get("/", [AuthMiddleware], ErrorHandler(getChatRooms));
chatRoutes.get("/:chatRoomId", [AuthMiddleware], ErrorHandler(getChatRoomById));
chatRoutes.post("/create", [AuthMiddleware], ErrorHandler(createChatRoom));
chatRoutes.put(
  "/:chatRoomId",
  [AuthMiddleware, OwnerChatRoomMiddleware],
  ErrorHandler(updateChatRoom)
);
chatRoutes.delete(
  "/:chatRoomId",
  [AuthMiddleware, OwnerChatRoomMiddleware],
  ErrorHandler(DeleteChatRoom)
);
chatRoutes.use("/:chatRoomId/user", userChatRoomRoutes);
chatRoutes.use("/:chatRoomId/message", messageRoutes);

export default chatRoutes;
