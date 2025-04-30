import { Router } from "express";
import { createPostController, deletePostController, getPostByIdController, getPostsController, updatePostController } from "../controllers/post_controller";

const router = Router();

router.get("/posts", getPostsController);
router.get("/posts/:id", getPostByIdController);
router.post("/posts", createPostController);
router.put("/posts/:id", updatePostController);
router.delete("/posts/:id", deletePostController);

export default router;
