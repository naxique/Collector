import { RequestHandler, response } from 'express'
import CollectionModel from '../models/collection'
import * as TagsController from '../controllers/tags';
import { newCollection as pushUserCollection, deleteCollection as deleteUserCollection } from './user';
import createHttpError from 'http-errors';

interface CustomFields {
  type: string,
  content: string
}

interface NewCollectionBody { 
  name?: string,
  authorId?: string,
  theme?: string, 
  description?: string,
  imageUrl?: string,
  customFields?: CustomFields[]
}

export const newCollection: RequestHandler<unknown, unknown, NewCollectionBody, unknown> =  async (request, response, next) => {
  const name = request.body.name,
        authorId = request.body.authorId,
        theme = request.body.theme,
        description = request.body.description,
        imageUrl = request.body.imageUrl,
        customFields = request.body.customFields;
  try {
    if (!name || !authorId || !theme) throw createHttpError(400, 'Missing parameters');

    const collection = await CollectionModel.create({
      name: name,
      authorId: authorId,
      theme: theme,
      customFields: customFields ? customFields : [{}],
      description: description ? description : "",
      imageUrl: imageUrl ? imageUrl : ""
    });
    await pushUserCollection(collection.authorId, collection._id.toString(), next);
    
    response.status(201).send('Collection created');
  } catch (error) {
    next(error);
  }
};

export const getAllCollections: RequestHandler = async (request, response, next) => {
  try {
    const collections = await CollectionModel.find();
    if (!collections) throw createHttpError(404, 'Collections not found');
    response.status(200).json(collections);
  } catch (error) {
    next(error);
  }
};

interface CollectionParams {
  collectionId?: string
}

export const getCollection: RequestHandler<CollectionParams, unknown, unknown, unknown> = async (request, response, next) => {
  const collectionId = request.params.collectionId;
  try {
    if (!collectionId) throw createHttpError(400, 'Bad request: missing parameters');
    const collection = await CollectionModel.findById(collectionId);
    if (!collection) throw createHttpError(404, 'Collection not found.')
    response.status(200).json(collection);
  } catch (error) {
    next(error);
  }
};

export const deleteCollection: RequestHandler<CollectionParams, unknown, unknown, unknown> = async (request, response, next) => {
  const collectionId = request.params.collectionId;
  try {
    if (!collectionId) throw createHttpError(400, 'Bad request: missing parameters');
    const collection = await CollectionModel.findById(collectionId);
    if (!collection) throw createHttpError(404, 'Collection not found.');
    await deleteUserCollection(collection.authorId, collection._id.toString(), next);
    await collection.remove();
    response.status(204).send('Collection deleted');
  } catch (error) {
    next(error);
  }
};

interface NewItemBody {
  name?: string,
  tags?: string[],
  customFields?: CustomFields[]
}

export const newCollectionItem: RequestHandler<CollectionParams, unknown, NewItemBody, unknown> = async (request, response, next) => {
  const name = request.body.name,
        tags = request.body.tags,
        customFields = request.body.customFields,
        collectionId = request.params.collectionId;
  try {
    if (!name || !tags || !collectionId) throw createHttpError(400, 'Bad request: missing parameters');
    const collection = await CollectionModel.findById(collectionId);
    if (!collection) throw createHttpError(404, 'Collection not found');
    const id = collection.items[0].name === undefined ? 1 : collection.items.length+1;

    const newItem = {
      id: id,
      name: name,
      tags: tags,
      likedBy: [""],
      commentIds: [""],
      customFields: [{}],
      collectionId: collection._id,
      createdAt: Date.now()
    };
    if (customFields) newItem.customFields = customFields;
    newItem.tags.map((el) => TagsController.newTag(el, next));

    if (collection.items[0].name === undefined) collection.items[0] = newItem;
    else collection.items.push(newItem);
    await collection.save();
    response.status(201).send('Item created');
  } catch (error) {
    next(error);
  }
};

interface EditItemBody {
  itemId?: number,
  name?: string,
  tags?: string[],
  customFields?: CustomFields[]
}

export const patchCollectionItem: RequestHandler<CollectionParams, unknown, EditItemBody, unknown> = async (request, response, next) => {
  const name = request.body.name,
        itemId = request.body.itemId,
        tags = request.body.tags,
        customFields = request.body.customFields,
        collectionId = request.params.collectionId;
  try {
    if (!collectionId || !itemId) throw createHttpError(400, 'Bad request: missing parameters');
    const collection = await CollectionModel.findById(collectionId);
    if (!collection) throw createHttpError(404, 'Collection not found');

    const item = collection.items[itemId];
    item.name = name ? name : item.name;
    if (tags && item.tags !== tags) {
      item.tags.map((el: string) => TagsController.unuseTag(el, next));
      item.tags = tags;
      item.tags.map((el: string) => TagsController.newTag(el, next));
    }
    item.customFields = customFields ? customFields : item.customFields;
    collection.items[itemId] = item;
    await collection.save();
    response.status(200).send('Item patched');
  } catch (error) {
    next(error);
  }
};

interface LikeItemBody {
  itemId?: number,
  unlike?: boolean,
  userId?: string
}

export const likeCollectionItem: RequestHandler<CollectionParams, unknown, LikeItemBody, unknown> = async (request, response, next) => {
  const itemId = request.body.itemId,
        userId = request.body.userId,
        unlike = request.body.unlike,
        collectionId = request.params.collectionId;
  try {
    if (!userId || !itemId || unlike === null || !collectionId) throw createHttpError(400, 'Bad request: missing parameters');
    const collection = await CollectionModel.findById(collectionId);
    if (!collection) throw createHttpError(404, 'Collection not found');
    const item = collection.items[itemId-1];

    if (unlike) {
      if (!item.likedBy.includes(userId)) throw createHttpError(400, 'This user have no like on this item');
      item.likedBy = item.likedBy.filter((el: string) => el !== userId);
    } else {
      if (item.likedBy.length === 1) item.likedBy[0] = userId;
      else item.likedBy.push(userId);
    }
    collection.items[itemId-1] = item;
    await collection.save();
    response.status(200).send('Item like changed');
  } catch (error) {
    next(error);
  }
};

interface ItemId {
  itemId?: number
}

export const deleteCollectionItem: RequestHandler<CollectionParams, unknown, ItemId, unknown> = async (request, response, next) => {
  const itemId = request.body.itemId,
        collectionId = request.params.collectionId;
  try {
    if (!itemId || !collectionId) throw createHttpError(400, 'Bad request: missing parameters');
    const collection = await CollectionModel.findById(collectionId);
    if (!collection) throw createHttpError(404, 'Collection not found');

    collection.items = collection.items.filter((el) => el.id !== itemId);
    await collection.save();
    response.status(200).send('Item deleted');
  } catch (error) {
    next(error);
  }
};

export const getAllCollectionItems: RequestHandler<CollectionParams, unknown, unknown, unknown> = async (request, response, next) => {
  const collectionId = request.params.collectionId;
  try {
    if (!collectionId) throw createHttpError(400, 'Bad request: missing parameters');
    const collection = await CollectionModel.findById(collectionId);
    if (!collection) throw createHttpError(404, 'Collection not found');
    response.send(200).json(collection.items);
  } catch (error) {
    next(error);
  }
};

interface GetItemParams {
  collectionId: string,
  itemId: number
}

export const getCollectionItem: RequestHandler<GetItemParams, unknown, unknown, unknown> = async (request, response, next) => {
  const collectionId = request.params.collectionId,
        itemId = request.params.itemId;
  try {
    if (!collectionId || !itemId) throw createHttpError(400, 'Bad request: missing parameters');
    const collection = await CollectionModel.findById(collectionId);
    if (!collection) throw createHttpError(404, 'Collection not found');
    if (itemId > collection.items.length || itemId < 1) throw createHttpError(404, 'Item not found');
    response.send(200).json(collection.items[itemId]);
  } catch (error) {
    next(error);
  }
};