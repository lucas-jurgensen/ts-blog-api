import express from "express";
import postRoutes from "./routes/posts.routes";
import commentRoutes from "./routes/comments.routes";

const app = express();
app.use(express.json());

app.use("/api", postRoutes);
app.use("/api", commentRoutes);

app.listen(3000, () => {
    console.log("ok http://localhost:3000");
});
