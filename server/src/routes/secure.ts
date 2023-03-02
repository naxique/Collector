import express from "express";
import * as UserController from "../controllers/user";
import * as CollectionController from "../controllers/collection";
import * as CommentsController from '../controllers/comments';

const router = express.Router();

router.post("/user/logout", UserController.logout);
// request body: name, authorId, theme : string (!), description, imageUrl : string, customFields: object[{type: string, content: string}]
router.post("/collection/", CollectionController.newCollection);
// request body: name: string, tags: string[], authorId: string, customFields: object[{type: string, content: string}]
router.post("/collection/:collectionId/item/", CollectionController.newCollectionItem);
// request body: itemId: number, unlike: boolean, userId: string
router.post("/collection/:collectionId/item/like", CollectionController.likeCollectionItem);
// request body: authorId, text: string
router.post("/comments/", CommentsController.newComment);

// request body: description: string
router.patch("/user/:userId/patchDesc", UserController.patchDescription);
// request body: itemId: number, name : string, tags: string[], customFields: object[{type: string, content: string}]
router.patch("/collection/:collectionId/item/", CollectionController.patchCollectionItem);

router.delete("/user/:userId", UserController.deleteUser);
router.delete("/collection/:collectionId", CollectionController.deleteCollection);
// request body: itemId: number
router.delete("/collection/:collectionId/item/", CollectionController.deleteCollectionItem);
router.delete("/comments/:commentId", CommentsController.deleteCommentById);

export default router;