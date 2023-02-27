import { RequestHandler } from 'express'
import CommentModel from '../models/comment'
import createHttpError from 'http-errors';

interface NewCommentBody {
  authorId?: string,
  text?: string
}

export const newComment: RequestHandler<unknown, unknown, NewCommentBody, unknown> =  async (request, response, next) => {
  const authorId = request.body.authorId,
        text = request.body.text;
  try {
    if (!authorId || !text) throw createHttpError(400, 'Bad request: missing parameters');
    const comment = await CommentModel.create({
      authorId: authorId,
      text: text
    });
    response.status(201).json(comment);
  } catch (error) {
    next(error);
  }
}

interface CommentIdParams {
  commentId?: string
}

export const getCommentById: RequestHandler<CommentIdParams, unknown, unknown, unknown> =  async (request, response, next) => {
  const commentId = request.params.commentId;
  try {
    if (!commentId) throw createHttpError(400, 'Bad request: missing parameters');
    const comment = await CommentModel.findById(commentId);
    if (!comment) throw createHttpError(404, 'Comment not found');
    response.status(200).json(comment);
  } catch (error) {
    next(error);
  }
}

export const deleteCommentById: RequestHandler<CommentIdParams, unknown, unknown, unknown> =  async (request, response, next) => {
  const commentId = request.params.commentId;
  try {
    if (!commentId) throw createHttpError(400, 'Bad request: missing parameters');
    const comment = await CommentModel.findById(commentId);
    if (!comment) throw createHttpError(404, 'Comment not found.');
    await comment.remove();
    response.status(204).send('Comment deleted');
  } catch (error) {
    next(error);
  }
}

export const getAllComments: RequestHandler =  async (request, response, next) => {
  try {
    const comments = await CommentModel.find();
    if (!comments) throw createHttpError(404, 'Comments not found');
    response.status(200).json(comments);
  } catch (error) {
    next(error);
  }
}