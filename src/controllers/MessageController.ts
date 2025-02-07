import express, { Request, Response, NextFunction } from "express";
import { prismaClient } from "../../server";
import { ZodError } from "zod";
import { ErrorCode, HttpException } from "../exception/root";
import { MessageSchema } from "../schema/message";

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const messages = await prismaClient.message.findMany({
    where:{
      chatRoomId: +req.params.chatRoomId
    },
    include: {
      sender: true,
    },
  });
  res.json(messages);
};

export const addMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    MessageSchema.parse(req.body);
  } catch (err: any) {
    if (err instanceof ZodError)
      return next(
        new HttpException(ErrorCode.INVALID_DATA_400, 400, err.errors)
      );
    return next(
      new HttpException(ErrorCode.GENERAL_EXCEPTION_100, 100, err.message)
    );
  }

  try {
    console.log(req.body);
    const newMessage = await prismaClient.message.create({
      data: {
        content: req.body.content,
        sender: {
          connect: { id: Number(req.user.id) },
        },
        chatRoom: {
          connect: { id: +req.params.chatRoomId },
        },
      },
      include: {
        sender: true, // This includes the sender details in the returned object
      },
    });
    res.json(newMessage);
  } catch (err: any) {
    console.log(err.message);
  }
};

export const updateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = await prismaClient.message.findFirst({
      where: { id: +req.params.messageId },
    });
    if (!message) return next(new HttpException(ErrorCode.NOT_FOUND_404, 404));

    const updatedMessage = await prismaClient.message.update({
      where: { id: message.id },
      data: req.body,
    });

    res.json(updatedMessage);
  } catch (err: any) {
    return next(
      new HttpException(ErrorCode.GENERAL_EXCEPTION_100, 404, err.message)
    );
  }
};

export const DeleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = await prismaClient.message.delete({
      where: { id: +req.params.messageId },
    });
    res.json(message);
  } catch (err) {
    return next(new HttpException(ErrorCode.NOT_FOUND_404, 404));
  }
};
