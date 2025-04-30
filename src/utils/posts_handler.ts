import { readFile, writeFile } from "fs/promises";

const posts_data = "./src/db/posts.json";
const comments_data = "./src/db/comments.json";

export const getPosts = async () => {
    try {
        const raw_posts = await readFile(posts_data, "utf-8");
        const raw_comments = await readFile(comments_data, "utf-8");

        const posts = JSON.parse(raw_posts);
        const comments = JSON.parse(raw_comments);

        const postsWithComments = posts.map((post) => {
            const postComments = comments.filter((c) => c.postId === post.id);
            return { ...post, comments: postComments };
        });

        return postsWithComments;
    } catch (err) {
        console.log("erro ao listar postagens do blog: ", err);
        throw new Error("erro ao listar postagens do blog");
    }
};

export const getPostById = async (id) => {
    const posts = await getPosts();
    return posts.find((post) => post.id === id);
};

export const createPost = async (title, content, author) => {
    const posts = await getPosts();

    try {
        const ids = posts.map((p) => p.id);
        const newId = posts.length > 0 ? Math.max(...ids) + 1 : 1;

        const newPost = {
            id: newId,
            title,
            content,
            author,
        };

        posts.push(newPost);

        await writeFile(posts_data, JSON.stringify(posts, null, 2));

        return newPost;
    } catch (err) {
        console.log("erro ao criar postagem: ", err);
        throw new Error("erro ao criar postagem no blog");
    }
};

export const updatePostById = async (id: number, updatedData: { title?: string; content?: string }) => {
    try {
        const posts = await getPosts();
        const postIndex = posts.findIndex((p) => p.id === id);

        if (postIndex === -1) {
            return { success: false, error: "postagem não encontrada" };
        }

        const updatedPost = {
            ...posts[postIndex],
            title: updatedData.title ?? posts[postIndex].title,
            content: updatedData.content ?? posts[postIndex].content,
        };

        posts[postIndex] = updatedPost;
        await writeFile(posts_data, JSON.stringify(posts, null, 2));

        return { success: true, post: updatedPost };
    } catch (err) {
        console.error("erro ao editar postagem:", err);
        throw new Error("falha ao editar postagem");
    }
};

export const deletePost = async (id: number) => {
    try {
        const posts = await getPosts();
        const postIndex = posts.findIndex((p) => p.id === id);

        if (postIndex === -1) {
            return { success: false, message: "postagem não encontrada" };
        }

        const [deletedPost] = posts.splice(postIndex, 1);
        await writeFile(posts_data, JSON.stringify(posts, null, 2));

        return { success: true, deletedPost };
    } catch (err) {
        console.log("erro ao deletar postagem: ", err);
        throw new Error("erro ao deletar postagem");
    }
};
