require("dotenv").config();
const cors = require("cors");
const express = require("express");
const {
  readPosts,
  createPosts,
  updatePost,
  deletePost,
  updateLike,
} = require("../utils/pg");
const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Bienvenido al servidor de Like Me!");
});

app.get("/posts", async (_, res) => {
  try {
    const posts = await readPosts();
    const uniquePosts = Array.from(new Set(posts.map((p) => p.id))).map(
      (id) => {
        return posts.find((p) => p.id === id);
      }
    );
    res.status(200).json(uniquePosts);
  } catch (error) {
    res.status(500).json({ message: "Error al leer los posts." });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { titulo, url, descripcion } = req.body;
    const post = await createPosts({ titulo, url, descripcion });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el post." });
  }
});

app.put("/posts/:id", async (req, res) => {
  try {
    const result = await updatePost(req.params.id, req.body);
    res.status(result?.code ? 500 : 200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const result = await deletePost(req.params.id);
    res.status(result?.code ? 500 : 200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/posts/like/:id", async (req, res) => {
  try {
    const result = await updateLike(req.params.id);
    res.status(result?.code ? 500 : 200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.all("*", (_, res) =>
  res.status(404).json({ code: 404, message: "La ruta no existe" })
);

app.listen(PORT, () =>
  console.log(`Server started on: http://localhost:${PORT}`)
);
