import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { PrismaClient } from "@prisma/client";
import { schema } from "./graphql";
import { genContext } from "./graphql/context";

const server = express();
const port = 3030;

const prismaClient = new PrismaClient();

if(process.env.NODE_ENV === "development") {
    server.use(cors());
}

server.get("/", (_req, res) => res.send("Hello world"));

server.use(
  "/graphql",
  graphqlHTTP((_req, _res, _graphQLParams) => {
    return {
      schema: schema,
      context: genContext(prismaClient),
      graphiql: process.env.NODE_ENV === "development",
    };
  })
);

server.listen(port, () =>
  console.log(`Server started at http://localhost:${port}`)
);
