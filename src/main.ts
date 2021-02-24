import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { schema } from "./graphql";
import { genContext } from "./graphql/context";
import { execute, subscribe } from "graphql";
import expressPlayground from "graphql-playground-middleware-express";

const server = express();
const port = 3030;

const prismaClient = new PrismaClient();

if (process.env.NODE_ENV === "development") {
  server.use(cors());
}

server.get("/", (_req, res) => res.send("Hello world"));

server.use(
  "/graphql",
  graphqlHTTP((_req, _res, _graphQLParams) => {
    return {
      schema: schema,
      context: genContext(prismaClient),
      graphiql: false,
    };
  })
);

if (process.env.NODE_ENV === "development") {
  server.get(
    "/playground",
    expressPlayground({
      endpoint: "/graphql",
      subscriptionEndpoint: `ws://localhost:${port}/subscriptions`,
    })
  );
}

const ws = createServer(server);

ws.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
  // Set up the WebSocket for handling GraphQL subscriptions.
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server: ws,
      path: "/subscriptions",
    }
  );
});
