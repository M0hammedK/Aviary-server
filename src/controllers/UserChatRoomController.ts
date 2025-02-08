import express, { Request, Response, NextFunction } from "express";
import { prismaClient } from "../../server";
import { ZodError } from "zod";
import { ErrorCode, HttpException } from "../exception/root";
import { User } from "@prisma/client";
import { compareSync } from "bcrypt";

export const getUsersChatRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const usersChatRoom = await prismaClient.userChatRoom.findMany();
  res.json(usersChatRoom);
};

export const getUserChatRoomById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userChatRoom = await prismaClient.userChatRoom.findFirst({
    where: { id: +req.params.userChatRoomId },
  });
  if (!userChatRoom)
    return next(new HttpException(ErrorCode.NOT_FOUND_404, 404));

  res.json(userChatRoom);
};

export const addUserChatRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatRoom = await prismaClient.chatRoom.findFirstOrThrow({
      where: { id: +req.params.chatRoomId },
    });
    if (chatRoom.password)
      if (!compareSync(req.body.password, chatRoom.password!))
        return next(new HttpException(ErrorCode.INVALID_DATA_400, 400));
    const newUserChatRoom = await prismaClient.userChatRoom.create({
      data: {
        user: {
          connect: { id: Number((req as Request & { user: User }).user.id) },
        },
        chatRoom: {
          connect: { id: chatRoom.id },
        },
      },
    });

    res.json(newUserChatRoom);
  } catch (err) {
    return next(new HttpException(ErrorCode.NOT_FOUND_404, 404));
  }
};

export const leaveUserChatRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userChatRoom = await prismaClient.userChatRoom.delete({
      where: { id: +req.params.userChatRoomId },
    });
    res.json(userChatRoom);
  } catch (err) {
    return next(new HttpException(ErrorCode.NOT_FOUND_404, 404));
  }
};
