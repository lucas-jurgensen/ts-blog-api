import { Request, Response, RequestHandler } from "express";
import { createPost, deletePost, getPostById, getPosts, updatePostById } from "../utils/posts_handler";
import { createPostSchema, updatePostSchema } from "../schemas/post_schema";

export const getPostsController = async (req: Request, res: Response) => {
    try {
        const posts = await getPosts();
        res.status(200).json({ success: true, posts });
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ success: false, error: "erro ao listar postagens" });
    }
};

export const getPostByIdController: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const postId = Number(id);

        if (isNaN(postId)) {
            res.status(400).json({ success: false, error: "id inválido" });
            return;
        }

        const post = await getPostById(postId);

        if (!post) {
            res.status(404).json({ success: false, message: "post não encontrado" });
            return;
        }

        res.status(200).json({ success: true, post });
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ success: false, error: "erro ao encontrar postagem" });
    }
};

export const createPostController: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { title, content, author } = req.body;

        const validation = createPostSchema.safeParse({
            title,
            content,
            author,
        });

        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: "erro na validação dos dados enviados",
                errors: validation.error.errors,
            });
            return;
        }

        const newPost = await createPost(title, content, author);

        res.status(201).json({
            success: true,
            message: "postagem criada com sucesso",
            post: newPost,
        });
    } catch (err: any) {
        console.log("erro ao criar postagem: ", err);
        res.status(500).json({ success: false, message: "erro ao criar postagem" });
    }
};

export const updatePostController: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const postId = Number(id);
        if (isNaN(postId)) {
            res.status(400).json({
                success: false,
                error: "id da postagem inválido",
            });
            return;
        }

        const validation = updatePostSchema.safeParse({ title, content });
        if (!validation.success) {
            res.status(400).json({
                success: false,
                error: "dados inválidos",
                details: validation.error.errors,
            });
            return;
        }

        const result = await updatePostById(postId, { title, content });

        if (!result.success) {
            res.status(404).json({
                success: false,
                error: result.error,
            });

            return;
        }

        res.status(200).json({
            success: true,
            message: "Postagem atualizada com sucesso",
            post: result.post,
        });
        return;
    } catch (err: any) {
        console.error("Erro no controller:", err);
        res.status(500).json({
            success: false,
            error: err.message || "Erro ao editar postagem",
        });
        return;
    }
};

export const deletePostController: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const postId = Number(id);

        if (isNaN(postId)) {
            res.status(400).json({
                success: false,
                error: "id inválido",
            });
            return;
        }

        const result = await deletePost(postId);

        if (!result.success) {
            res.status(404).json({
                success: false,
                message: result.message,
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "postagem deletada com sucesso",
            post: result.deletedPost,
        });

        return;
    } catch (err: any) {
        console.error("erro ao excluir postagem:", err);
        res.status(500).json({
            success: false,
            message: "erro ao excluir postagem",
        });
        return;
    }
};
