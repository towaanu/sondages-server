import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema";

const server = express();
const port = 3030;

server.get("/", (_req, res) => res.send("Hello world"));

server.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

server.listen(port, () =>
  console.log(`Server started at http://localhost:${port}`)
);
