import { NextFunction, RequestHandler } from 'express'
import TagModel from '../models/tag'
import createHttpError from 'http-errors';

export const newTag = async (tagName: string, next: NextFunction) => {
  try {
    const existingTag = await TagModel.findOne({ name: tagName });
    if (existingTag) {
      existingTag.timesUsed++;
      await existingTag.save();
    } else {
      await TagModel.create({
        name: tagName
      });
    } 
  } catch (error) {
    next(error);
  }
};

export const unuseTag = async (tagName: string, next: NextFunction) => {
  try {
    const existingTag = await TagModel.findOne({ name: tagName });
    if (existingTag && existingTag.timesUsed > 0) {
      existingTag.timesUsed--;
      await existingTag.save();
    }
  } catch (error) {
    next(error);
  }
};

export const getAllTags: RequestHandler = async (request, response, next) => {
  try {
    const tags = await TagModel.find();
    if (!tags) throw createHttpError(404, 'Tags not found');
    response.status(200).json(tags);
  } catch (error) {
    next(error);
  }
}