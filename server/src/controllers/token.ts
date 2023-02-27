import TokenModel from '../models/token'
import createHttpError from "http-errors";
import * as jwt from 'jsonwebtoken';
import "dotenv/config";

export const newToken = async (token: string): Promise<boolean | null> => {
  try {
    const existingToken = await TokenModel.findOne({ token: token });
    if (existingToken) return null;
    const newToken = await TokenModel.create({ token: token });
    return newToken ? true : false;
  } catch (error) {
    throw createHttpError(400, error as string);
  }
};

export const deleteExpiredTokens = async () => {
  try {
    const existingTokens = await TokenModel.find();
    if (!existingTokens) return;
    existingTokens.map((token) => {
      const decodedToken = jwt.verify(token.token, process.env.JWT_KEY!) as { exp: number };
      if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) token.remove();
    });
  } catch (error) {
    throw createHttpError(400, error as string);
  }
};

export const getToken = async (token: string): Promise<boolean> => {
  try {
    const existingToken = await TokenModel.findOne({ token: token });
    return existingToken ? true : false;
  } catch (error) {
    throw createHttpError(400, error as string);
  }
};