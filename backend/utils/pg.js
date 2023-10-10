require("dotenv").config();
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

const config = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  allowExitOnIdle: true,
};

const pool = new Pool(config);

const executeQuery = async (query, values) =>
  pool
    .query(query, values)
    .then(({ rows }) => rows)
    .catch(({ code, message }) => ({ code, message }));

const readPosts = async () => {
  const dbResponse = await executeQuery("SELECT * FROM posts ORDER BY titulo;");
  return dbResponse;
};

const createPosts = async ({ titulo, url: img, descripcion }) => {
  const query =
    "INSERT INTO posts(id, titulo, img, descripcion) VALUES($1, $2, $3, $4) RETURNING *;";
  const postValues = [uuidv4(), titulo, img, descripcion];
  return await executeQuery(query, postValues);
};

module.exports = {
  readPosts,
  createPosts,
};
