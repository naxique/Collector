import "dotenv/config";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import * as jwt from 'jsonwebtoken';
import UserModel from "../models/user";
import * as TokenController from '../controllers/token';

export const authVerify: RequestHandler = async (request, response, next) => {
  const token = request.body.token;    
  try {
    if (!token) next(createHttpError(401, 'User not authenticated'));
    const blacklistedToken = await TokenController.getToken(token);
    if (blacklistedToken) next(createHttpError(401, 'User not authenticated'));

    const decodedToken = jwt.verify(token, process.env.JWT_KEY!) as { username: string, exp: number };
    if (!decodedToken) next(createHttpError(401, 'Bad token'));
    if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) next(createHttpError(401, 'Token expired. Please log in.'));
    const user = await UserModel.findOne({ username: decodedToken.username }).exec();
    if (!user) next(createHttpError(401, 'User not found'));
    if (user!.isBlocked) next(createHttpError(401, 'User blocked'));

    TokenController.deleteExpiredTokens();

    next();
  } catch (error) {
    next(error);
  }
}