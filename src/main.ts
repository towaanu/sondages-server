import express from "express";

const server = express();
const port = 3030;

server.get("/", (_req, res) => res.send("Hello world"));

server.listen(port, () =>
  console.log(`Server started at http://localhost:${port}`)
);
