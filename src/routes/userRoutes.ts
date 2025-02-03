import { Router } from "express";
import { AdminMiddleware } from "../middlewares/admin";
import {
  DeleteUser,
  GetUserById,
  GetUsers,
  UpdateUser,
} from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/auth";
import { ErrorHandler } from "../schema/errorHandler";

const userRoutes = Router();

userRoutes.get(
  "/",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(GetUsers)
);
userRoutes.get(
  "/:userId",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(GetUserById)
);
userRoutes.delete(
  "/:userId",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(DeleteUser)
);
userRoutes.put(
  "/:userId",
  [AuthMiddleware],
  ErrorHandler(UpdateUser)
);

export default userRoutes;
