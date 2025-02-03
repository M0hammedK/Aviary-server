import express, { Request, Response, NextFunction } from "express";
import { ErrorCode, HttpException } from "../exception/root";
import { prismaClient } from "../../server";
import { verifyAccessToken } from "../utils/tokenUtils";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(new HttpException(ErrorCode.UNAUTHORIZED_ACCESS_401, 401));
  }
  try {
    const payload = verifyAccessToken(token);

    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user)
      return next(new HttpException(ErrorCode.UNAUTHORIZED_ACCESS_401, 401));

    (req.user as any) = user;
    return next();
  } catch (err: any) {
    let exception;
    if (err instanceof HttpException) exception = err;
    else
      exception = new HttpException(
        ErrorCode.GENERAL_EXCEPTION_100,
        100,
        err.errors
      );
    return next(exception);
  }
};
