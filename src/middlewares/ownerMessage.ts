import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../../server";
import { User } from "@prisma/client";
import { ErrorCode, HttpException } from "../exception/root";

export const OwnerMessageMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as Request & { user: User }).user.role === "ADMIN") return next();
  try {
    const messageOwner = await prismaClient.message.findFirstOrThrow({
      where: { senderId: +req.params.userId },
    });
    if (
      messageOwner.senderId ===
      Number((req as Request & { user: User }).user.id)
    )
      return next();

    return next(new HttpException(ErrorCode.UNAUTHORIZED_ACCESS_401, 401));
  } catch (err) {
    return next(new HttpException(ErrorCode.NOT_FOUND_404, 404));
  }
};
