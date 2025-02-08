import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../../server";
import { ChatRoomSchema } from "../schema/chatRoom";
import { ZodError } from "zod";
import { ErrorCode, HttpException } from "../exception/root";
import { User } from "@prisma/client";
import { hashSync } from "bcrypt";

export const getChatRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const chatRooms = await prismaClient.chatRoom.findMany({
    include: {
      owner: true,
    },
  });
  res.json(chatRooms);
};

export const getChatRoomById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const chatRoom = await prismaClient.chatRoom.findFirst({
    where: { id: +req.params.chatRoomId },
  });
  if (!chatRoom) return next(new HttpException(ErrorCode.NOT_FOUND_404, 404));

  res.json(chatRoom);
};

export const createChatRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    ChatRoomSchema.parse(req.body);
  } catch (err: any) {
    if (err instanceof ZodError)
      return next(
        new HttpException(ErrorCode.INVALID_DATA_400, 400, err.errors)
      );
    return next(
      new HttpException(ErrorCode.GENERAL_EXCEPTION_100, 100, err.message)
    );
  }
  if (req.body.password) req.body.password = hashSync(req.body.password, 10);
  const newChatRoom = await prismaClient.chatRoom.create({
    data: {
      ...req.body,
      owner: {
        connect: { id: (req as Request & { user: User }).user.id },
      },
      isGroup: true,
    },
  });
  const newUserChatRoom = await prismaClient.userChatRoom.create({
    data: {
      user: {
        connect: { id: Number((req as Request & { user: User }).user.id) },
      },
      chatRoom: {
        connect: { id: newChatRoom.id },
      },
    },
  });

  res.json(newChatRoom);
};

export const updateChatRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatRoom = await prismaClient.chatRoom.findFirst({
      where: { id: +req.params.chatRoomId },
    });
    if (!chatRoom) return next(new HttpException(ErrorCode.NOT_FOUND_404, 404));

    const updatedChatRoom = await prismaClient.chatRoom.update({
      where: { id: chatRoom.id },
      data: req.body,
    });

    res.json(updatedChatRoom);
  } catch (err: any) {
    return next(
      new HttpException(ErrorCode.GENERAL_EXCEPTION_100, 404, err.message)
    );
  }
};

export const DeleteChatRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatRoom = await prismaClient.chatRoom.delete({
      where: { id: +req.params.chatRoomId },
    });
    res.json(chatRoom);
  } catch (err) {
    return next(new HttpException(ErrorCode.NOT_FOUND_404, 404));
  }
};
