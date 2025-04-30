import { Request, Response, RequestHandler } from "express";
import { createComment, deleteComment, getPostComments, updateComment } from "../utils/comments_handler";
import { commentSchema, updateCommentSchema } from "../schemas/comment_schema";

export const getPostCommentsController: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const postId = parseInt(id, 10);

        if (isNaN(postId)) {
            res.status(400).json({ error: "id da postagem inválido" });
            return;
        }

        const comments = await getPostComments(postId);
        res.status(200).json(comments);
    } catch (err: any) {
        console.error("erro ao buscar comentários:", err);
        res.status(500).json({ error: err.message || "erro ao carregar comentários" });
    }
};

export const createCommentController: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { content, author } = req.body;
        const postId = parseInt(id, 10);

        if (isNaN(postId)) {
            res.status(400).json({ error: "id da postagem inválido" });
            return;
        }

        if (!content || !author) {
            res.status(400).json({ error: "conteúdo e autor são obrigatórios" });
            return;
        }

        const newComment = await createComment(postId, content, author);
        res.status(201).json(newComment);
    } catch (err: any) {
        console.error("erro ao criar comentário:", err);

        if (err.message === "postagem não encontrado") {
            res.status(404).json({ error: err.message });
            return;
        }

        res.status(500).json({ error: err.message || "erro ao criar comentário" });
    }
};

export const updateCommentController: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { id: postId, commentId } = req.params;
        const { content } = req.body;

        const post = Number(postId);
        const comment = Number(commentId);

        if (isNaN(post) || isNaN(comment)) {
            res.status(400).json({ success: false, error: "ids inválidos" });
            return;
        }

        const validation = updateCommentSchema.safeParse({ content });
        if (!validation.success) {
            res.status(400).json({
                success: false,
                error: "dados inválidos",
                errors: validation.error.errors,
            });
            return;
        }

        const result = await updateComment(post, comment, content);

        if (!result.success) {
            res.status(404).json({
                success: false,
                error: result.error,
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "comentário editado com sucesso",
            comment: result.comment,
        });
    } catch (err) {
        console.error("erro ao editar comentário:", err);
        res.status(500).json({
            success: false,
            error: "erro ao editar comentário",
        });
    }
};

export const deleteCommentController: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { id: postId, commentId } = req.params; //

        const post = Number(postId);
        const comment = Number(commentId);

        if (isNaN(post) || isNaN(comment)) {
            res.status(400).json({ success: false, error: "IDs inválidos" });
            return;
        }

        const result = await deleteComment(post, comment);

        if (!result.success) {
            res.status(404).json({
                success: false,
                error: result.error,
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "comentário deletado com sucesso",
            comment: result.comment,
        });
    } catch (err) {
        console.error("erro ao deletar comentário:", err);
        res.status(500).json({
            success: false,
            error: "erro ao deletar comentário",
        });
    }
};
