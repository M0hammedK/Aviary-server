import express, { Request, Response, NextFunction } from "express";
import { UserSchema } from "../schema/users";
import { prismaClient } from "../../server";
import { ErrorCode, HttpException } from "../exception/root";
import { ZodError } from "zod";
import { User } from "@prisma/client";
import { hashSync, compareSync } from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    UserSchema.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError)
      return next(
        new HttpException(ErrorCode.INVALID_DATA_400, 400, err.errors)
      );
  }
  const { name, email, password, role } = req.body;
  const user = await prismaClient.user.findFirst({ where: { email } });

  if (user) return next(new HttpException(ErrorCode.ALREADY_EXIST_403, 403));
  const newUser = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
      role: "USER",
    },
  });
  res.json(newUser);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await prismaClient.user.findFirst({ where: { email } });

  if (!user) {
    console.log("notfound");
    return next(new HttpException(ErrorCode.NOT_FOUND_404, 404));
  }
  if (!compareSync(password, user!.password))
    return next(
      new HttpException(
        ErrorCode.INVALID_DATA_400,
        400,
        "Password not correct, try again!"
      )
    );

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ user, accessToken });
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  res.json((req as Request & { user: User }).user);
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  res.json((req as Request & { user: User }).user.name);
};
