import { readFile, writeFile } from "fs/promises";
import { getPostById } from "./posts_handler";

const comments_data = "./src/db/comments.json";
const readCommentsFromFile = async () => {
    try {
        const raw_comments = await readFile(comments_data, "utf-8");

        if (!raw_comments.trim()) {
            return [];
        }

        return JSON.parse(raw_comments);
    } catch (err) {
        console.log("erro ao ler arquivo de comentários: ", err);
        throw new Error("erro ao ler arquivo de comentários");
    }
};

export const getPostComments = async (postId: number) => {
    try {
        const allComments = await readCommentsFromFile();
        return allComments.filter((c) => c.postId === postId);
    } catch (err) {
        console.error("erro ao buscar comentários:", err);
        throw new Error("erro ao carregar comentários");
    }
};

export const createComment = async (postId: number, content: string, author: string) => {
    try {
        const postExists = await getPostById(postId);
        if (!postExists) {
            throw new Error("postagem não encontrado");
        }

        const allComments = await readCommentsFromFile();
        const ids = allComments.map((c) => c.id);
        const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

        const newComment = {
            id: newId,
            postId,
            content,
            author,
        };

        const updatedComments = [...allComments, newComment];
        await writeFile(comments_data, JSON.stringify(updatedComments, null, 2));

        return newComment;
    } catch (err) {
        console.error("erro ao criar comentário:", err);
        throw err;
    }
};

export const updateComment = async (postId: number, commentId: number, content: string) => {
    try {
        if (isNaN(postId) || isNaN(commentId)) {
            throw new Error("ids inválidos");
        }

        const allComments = await readCommentsFromFile();
        const commentIndex = allComments.findIndex((c) => c.id === commentId && c.postId === postId);

        if (commentIndex === -1) {
            return { success: false, error: "comentário não encontrado" };
        }

        const updatedComment = {
            ...allComments[commentIndex],
            content,
        };

        allComments[commentIndex] = updatedComment;
        await writeFile(comments_data, JSON.stringify(allComments, null, 2));

        return { success: true, comment: updatedComment };
    } catch (err) {
        console.error("erro ao editar comentário:", err);
        throw err;
    }
};

export const deleteComment = async (postId: number, commentId: number) => {
    try {
        if (isNaN(postId) || isNaN(commentId)) {
            throw new Error("ids inválidos");
        }

        const allComments = await readCommentsFromFile();
        const commentIndex = allComments.findIndex((c) => c.id === commentId && c.postId === postId);

        if (commentIndex === -1) {
            return { success: false, error: "comentário não encontrado" };
        }

        const [deletedComment] = allComments.splice(commentIndex, 1);
        await writeFile(comments_data, JSON.stringify(allComments, null, 2));

        return { success: true, comment: deletedComment };
    } catch (err) {
        console.error("erro ao deletar comentário:", err);
        throw err;
    }
};
