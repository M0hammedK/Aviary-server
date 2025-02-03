import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../../server";
import { ErrorCode, HttpException } from "../exception/root";

export const OwnerMessageMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role === "ADMIN") return next();
  try {
    const messageOwner = await prismaClient.message.findFirstOrThrow({
      where: { senderId: +req.params.userId },
    });
    if (messageOwner.senderId === Number(req.user.id)) return next();

    return next(new HttpException(ErrorCode.UNAUTHORIZED_ACCESS_401, 401));
  } catch (err) {
    return next(new HttpException(ErrorCode.NOT_FOUND_404, 404));
  }
};
