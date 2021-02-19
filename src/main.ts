import express from "express";
import { graphqlHTTP } from "express-graphql";
import { PrismaClient } from "@prisma/client";
import schema from "./graphql/schema";
import { genContext } from "./graphql/context";

const server = express();
const port = 3030;

const prismaClient = new PrismaClient();

server.get("/", (_req, res) => res.send("Hello world"));

server.use(
  "/graphql",
  graphqlHTTP((_req, _res, _graphQLParams) => {
    return {
      schema: schema,
      graphiql: true,
      context: genContext(prismaClient),
    };
  })
);

// server.use(
//   "/graphql",
//   graphqlHTTP({
//     schema: schema,
//     graphiql: true,
//   })
// );

server.listen(port, () =>
  console.log(`Server started at http://localhost:${port}`)
);
