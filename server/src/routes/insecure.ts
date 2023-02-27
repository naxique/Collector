import express from "express";
import * as UserController from "../controllers/user";
import * as CollectionController from "../controllers/collection";
import * as TagsController from '../controllers/tags';
import * as CommentsController from '../controllers/comments';

const router = express.Router();

router.get("/user/", UserController.getAllUsers);
router.get("/user/:userId", UserController.getUser);
router.get("/collection/", CollectionController.getAllCollections);
router.get("/collection/:collectionId", CollectionController.getCollection);
router.get("/collection/:collectionId/items/", CollectionController.getAllCollectionItems);
// request body: itemId: number
router.get("/collection/:collectionId/item/", CollectionController.getCollectionItem);
router.get("/tags/", TagsController.getAllTags);
router.get("/comments/", CommentsController.getAllComments);
router.get("/comments/:commentId", CommentsController.getCommentById);

// request body: username, email, password : string
router.post("/user/", UserController.newUser);
// request body: username, password : string
router.post("/user/login", UserController.login);

export default router;