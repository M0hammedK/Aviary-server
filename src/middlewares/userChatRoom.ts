import { Request, Response, NextFunction } from "express";
import { ErrorCode, HttpException } from "../exception/root";
import { prismaClient } from "../../server";
import { User } from "@prisma/client";

export const UserChatRoomMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as Request & { user: User }).user.role === "ADMIN") return next();
  try {
    const userChatRoom = await prismaClient.userChatRoom.findFirstOrThrow({
      where: {
        userId: Number((req as Request & { user: User }).user.id),
        chatRoomId: Number(req.params.chatRoomId),
      },
    });
    if (userChatRoom) return next();
    return next(new HttpException(ErrorCode.UNAUTHORIZED_ACCESS_401, 401));
  } catch (err: any) {
    return next(new HttpException(ErrorCode.NOT_FOUND_404, 404));
  }
};
