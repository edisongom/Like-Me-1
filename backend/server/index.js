require('dotenv').config()

const cors = require('cors')
const express = require('express')
const { readPosts, createPosts } = require('../utils/pg')
const PORT = process.env.PORT ?? 3000
const app = express()

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.send('¡Bienvenido al servidor de Like Me!');
});
app.get('/posts', async (_, res) => {
  const posts = await readPosts();
  const uniquePosts = Array.from(new Set(posts.map(p => p.id))).map(id => {
    return posts.find(p => p.id === id);
  });
  res.status(200).json(uniquePosts);
})


app.post('/posts', async (req, res) => {
  try {
    const { titulo, url, descripcion } = req.body;
    const post = await createPosts({ titulo, url, descripcion });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el post." });
  }
})

app.all('*', (_, res) => res.status(404).json({ code: 404, message: 'Page Not Found' }))

app.listen(PORT, () => console.log(`Server started on: http://localhost:${PORT}`))