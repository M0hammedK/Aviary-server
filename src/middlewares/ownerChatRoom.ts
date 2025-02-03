import { Request, Response, NextFunction } from "express";
import { ErrorCode, HttpException } from "../exception/root";
import { prismaClient } from "../../server";

export const OwnerChatRoomMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 
  if (req.user.role === "ADMIN") return next();

  try {
    const chatRoomId = await prismaClient.chatRoom.findFirstOrThrow({
      where: { ownerId: +req.params.userId },
    });

    if (chatRoomId.ownerId === Number(req.user.id)) return next();

    return next(new HttpException(ErrorCode.UNAUTHORIZED_ACCESS_401, 401));
  } catch (err) {
    return next(new HttpException(ErrorCode.NOT_FOUND_404, 404));
  }
};
