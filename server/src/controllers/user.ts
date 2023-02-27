import { NextFunction, RequestHandler } from "express";
import "dotenv/config";
import UserModel from '../models/user';
import createHttpError from "http-errors";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as TokenController from './token';

interface NewUserBody {
  username?: string,
  email?   : string,
  password?: string
}

export const newUser: RequestHandler<unknown, unknown, NewUserBody, unknown> =  async (request, response, next) => {
  const username = request.body.username,
        password = request.body.password,
        email    = request.body.email;
  try {
    if (!username || !email || !password) throw createHttpError(400, 'Missing parameters');

    const existingUsername = await UserModel.findOne({ username: username }).exec();
    const existingEmail    = await UserModel.findOne({ email: email }).exec();
    if (existingUsername) throw createHttpError(409, 'This username is already taken')
    else if (existingEmail) throw createHttpError(409, 'This email is already taken');

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username: username,
      password: encryptedPassword,
      email: email
    });

    response.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string,
  password?: string
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (request, response, next) => {
  const username = request.body.username,
        password = request.body.password;
  try {
    if (!username || !password) throw createHttpError(400, 'Missing parameters');

    const user = await UserModel.findOne({ username: username }).select("+password +email +isAdmin +isBlocked").exec();
    if (!user) throw createHttpError(401, 'Invalid username or password');
    const validPassword = await bcrypt.compare(password, user.password);
    if (user.isBlocked) throw createHttpError(401, 'This user is blocked.');
    if (!validPassword) throw createHttpError(401, 'Invalid username or password');

    const token = jwt.sign({ username }, process.env.JWT_KEY!, {
      expiresIn: '8h'
    });
    response.status(200).json({
      username: user.username,
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token
    });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (request, response, next) => {
  const token = request.body.token;
  try {
    const blacklistedToken = await TokenController.newToken(token);
    if (blacklistedToken) response.status(200).send('Logged out');
    else response.status(400).send('User already logged out.');
  } catch (error) {
    next(error);
  }
};

export const getAllUsers: RequestHandler = async (request, response, next) => {
  try {
    const users = await UserModel.find().exec();
    response.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

interface UserParams {
  userId?: string
}

export const getUser: RequestHandler<UserParams, unknown, unknown, unknown> = async (request, response, next) => {
  const userId = request.params.userId;
  try {
    if (!userId) throw createHttpError(400, 'Bad request: missing parameters');
    const user = await UserModel.findById(userId);
    if (!user) throw createHttpError(404, 'User not found.');
    response.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface NewDescBody {
  description?: string
}

export const patchDescription: RequestHandler<UserParams, unknown, NewDescBody, unknown> = async (request, response, next) => {
  const description = request.body.description,
        userId = request.params.userId;
  try {
    if (!description || !userId) throw createHttpError(400, 'Bad request: missing parameters');
    const user = await UserModel.findById(userId);
    if (!user) throw createHttpError(404, 'User not found.');
    user.description = description;
    await user.save();
    response.status(200).send('Patched');
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler<UserParams, unknown, unknown, unknown> = async (request, response, next) => {
  const userId = request.params.userId;
  try {
    if (!userId) throw createHttpError(400, 'Bad request: missing parameters');
    const user = await UserModel.findById(userId);
    if (!user) throw createHttpError(404, 'Collection not found.')
    await user.remove();
    response.status(204).send('User deleted');
  } catch (error) {
    next(error);
  }
};

export const newCollection = async (userId: string, collectionId: string, next: NextFunction) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) throw createHttpError(404, 'User not found');
    if (user.collections[0] === '') user.collections[0] = collectionId;
    else user.collections.push(collectionId);
    await user.save();
  } catch (error) {
    next(error);
  }
};

export const deleteCollection = async (userId: string, collectionId: string, next: NextFunction) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) throw createHttpError(404, 'User not found');
    user.collections = user.collections.filter((el) => el !== collectionId);
    await user.save();
  } catch (error) {
    next(error);  
  }
};