const pool = require('./pg');
const { v4: uuidv4 } = require('uuid');

const getPosts = async () => {
  const { rows } = await pool.query('SELECT * FROM posts');
  return rows;
};

const addPost = async (post) => {
  const id = uuidv4();
  await pool.query('INSERT INTO posts (id, titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4, $5)', [id, post.titulo, post.img, post.descripcion, 0]);
  return id;
};

const incrementLike = async (id) => {
  await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = $1', [id]);
};

const deletePost = async (id) => {
  await pool.query('DELETE FROM posts WHERE id = $1', [id]);
};

module.exports = {
  getPosts,
  addPost,
  incrementLike,
  deletePost
};
