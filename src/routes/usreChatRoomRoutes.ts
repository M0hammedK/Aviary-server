import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth";
import { ErrorHandler } from "../schema/errorHandler";
import { UserChatRoomMiddleware } from "../middlewares/userChatRoom";
import {
  addUserChatRoom,
  leaveUserChatRoom,
  getUserChatRoomById,
  getUsersChatRoom,
} from "../controllers/UserChatRoomController";
import { OwnerChatRoomMiddleware } from "../middlewares/ownerChatRoom";

const userChatRoomRoutes = Router({ mergeParams: true });

userChatRoomRoutes.get(
  "/",
  [AuthMiddleware, UserChatRoomMiddleware],
  ErrorHandler(getUsersChatRoom)
);
userChatRoomRoutes.get(
  "/:userChatRoomId",
  [AuthMiddleware, UserChatRoomMiddleware],
  ErrorHandler(getUserChatRoomById)
);
userChatRoomRoutes.post(
  "/add",
  [AuthMiddleware, OwnerChatRoomMiddleware],
  ErrorHandler(addUserChatRoom)
);
userChatRoomRoutes.delete(
  "/:userChatRoomId",
  [AuthMiddleware, OwnerChatRoomMiddleware],
  ErrorHandler(leaveUserChatRoom)
);

export default userChatRoomRoutes;
