import express from "express";
import { createCommentController, deleteCommentController, getPostCommentsController, updateCommentController } from "../controllers/comment_controller";

const router = express.Router();

router.get("/posts/:id/comments", getPostCommentsController);
router.post("/posts/:id/comments", createCommentController);
router.put("/posts/:id/comments/:commentId", updateCommentController);
router.delete("/posts/:id/comments/:commentId", deleteCommentController);

export default router;
